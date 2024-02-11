import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartQuotationDto } from './dto/create-cart-quotation.dto';
import { UpdateCartQuotationDto } from './dto/update-cart-quotation.dto';
import CartQuotation from './entities/cart-quotation.entity';
import toBoolean from 'src/utils/conversion/toBoolean';

@Injectable()
export class CartQuotationService {
  async create(
    user_extract: any,
    createCartQuotationDto: CreateCartQuotationDto,
  ) {
    try {
      await CartQuotation.create(
        {
          ...createCartQuotationDto,
          custom_attributes: JSON.stringify(
            createCartQuotationDto.custom_attributes || {},
          ),
          user_id: user_extract.id,
        },
        {
          fields: ['user_id', 'product_id', 'quantity'],
        },
      );
      return {
        statusCode: 201,
        message: `Product added to cart successfully`,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async findAll(user_extract: any) {
    return await CartQuotation.findAll({
      where: {
        user_id: user_extract.id,
      },
      include: [
        {
          association: 'product',
          include: [
            {
              association: 'brand',
            },
          ],
        },
      ],
      attributes: ['id', 'quantity', 'created_at', 'updated_at'],
    });
  }

  async update(
    user_extract: any,
    id: number,
    updateCartQuotationDto: UpdateCartQuotationDto,
  ) {
    try {
      const { quantity, custom_attributes } = updateCartQuotationDto;

      const cartQuotation = await CartQuotation.findByPk(id);

      if (!cartQuotation) throw new NotFoundException(`Cart not found`);

      if (cartQuotation.user_id !== user_extract.id) {
        throw new BadRequestException(
          `You don't have permission to update this cart`,
        );
      }

      await cartQuotation.update({
        quantity,
        ...(custom_attributes && {
          custom_attributes: JSON.stringify(custom_attributes || {}),
        }),
      });

      return {
        statusCode: 204,
        message: 'Cart updated successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to update cart',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  async remove(
    user_extract: any,
    id: number,
    permanent?: boolean,
    restore?: boolean,
  ) {
    const cartQuotation = await CartQuotation.findByPk(id, {
      paranoid: false,
    });

    if (!cartQuotation) {
      throw new NotFoundException(`Cart not found`);
    }

    if (cartQuotation.user_id !== user_extract.id) {
      throw new BadRequestException(
        `You don't have permission to delete this cart`,
      );
    }

    if (toBoolean(permanent)) {
      await cartQuotation.destroy({ force: true });
      return {
        message: 'Cart is deleted permanently',
      };
    } else if (toBoolean(restore)) {
      if (cartQuotation.deleted_at === null) {
        throw new BadRequestException(`Cart is not deleted`);
      }
      cartQuotation.restore();
      return {
        message: 'Cart is restored successfully',
      };
    }

    await cartQuotation.destroy();

    return {
      message: 'Cart deleted successfully',
    };
  }
}
