import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import Cart from './entities/cart.entity';
import toBoolean from 'src/utils/conversion/toBoolean';

@Injectable()
export class CartsService {
  async create(user_extract: any, createCartDto: CreateCartDto) {
    try {
      await Cart.create(
        {
          ...createCartDto,
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
    return await Cart.findAll({
      where: {
        user_id: user_extract.id,
      },
      include: [
        {
          association: 'product',
        },
      ],
      attributes: ['id', 'quantity', 'created_at', 'updated_at'],
    });
  }

  async update(user_extract: any, id: number, updateCartDto: UpdateCartDto) {
    try {
      const { quantity } = updateCartDto;

      const cart = await Cart.findByPk(id, {});

      if (!cart) throw new NotFoundException(`Cart not found`);

      if (cart.user_id !== user_extract.id) {
        throw new BadRequestException(
          `You don't have permission to update this cart`,
        );
      }

      await cart.update({
        quantity,
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
    const cart = await Cart.findByPk(id, {
      paranoid: false,
    });

    if (!cart) {
      throw new NotFoundException(`Cart not found`);
    }

    if (cart.user_id !== user_extract.id) {
      throw new BadRequestException(
        `You don't have permission to delete this cart`,
      );
    }

    if (toBoolean(permanent)) {
      await cart.destroy({ force: true });
      return {
        message: 'Cart is deleted permanently',
      };
    } else if (toBoolean(restore)) {
      if (cart.deleted_at === null) {
        throw new BadRequestException(`Cart is not deleted`);
      }
      cart.restore();
      return {
        message: 'Cart is restored successfully',
      };
    }

    await cart.destroy();

    return {
      message: 'Cart deleted successfully',
    };
  }
}
