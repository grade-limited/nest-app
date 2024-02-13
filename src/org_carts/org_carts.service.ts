import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrgCartDto } from './dto/create-org_cart.dto';
import { UpdateOrgCartDto } from './dto/update-org_cart.dto';
import OrgCart from './entities/org_cart.entity';
import toBoolean from 'src/utils/conversion/toBoolean';

@Injectable()
export class OrgCartsService {
  async create(user_extract: any, createOrgCartDto: CreateOrgCartDto) {
    try {
      await OrgCart.create(
        {
          ...createOrgCartDto,
          user_id: user_extract.id,
        },
        {
          fields: ['user_id', 'organization_id', 'product_id', 'quantity'],
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
    return await OrgCart.findAll({
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
    updateOrgCartDto: UpdateOrgCartDto,
  ) {
    try {
      const { quantity } = updateOrgCartDto;

      const orgCart = await OrgCart.findByPk(id, {});

      if (!orgCart)
        throw new NotFoundException(`Organization's Cart not found`);

      if (orgCart.user_id !== user_extract.id) {
        throw new BadRequestException(
          `You don't have permission to update this cart`,
        );
      }

      await orgCart.update({
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
    const orgCart = await OrgCart.findByPk(id, {
      paranoid: false,
    });

    if (!orgCart) {
      throw new NotFoundException(`Cart not found`);
    }

    if (orgCart.user_id !== user_extract.id) {
      throw new BadRequestException(
        `You don't have permission to delete this cart`,
      );
    }

    if (toBoolean(permanent)) {
      await orgCart.destroy({ force: true });
      return {
        message: 'Cart is deleted permanently',
      };
    } else if (toBoolean(restore)) {
      if (orgCart.deleted_at === null) {
        throw new BadRequestException(`Cart is not deleted`);
      }
      orgCart.restore();
      return {
        message: 'Cart is restored successfully',
      };
    }

    await orgCart.destroy();

    return {
      message: 'Cart deleted successfully',
    };
  }
}
