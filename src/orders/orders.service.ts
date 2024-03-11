import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import Order from './entities/order.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';
import toBoolean from 'src/utils/conversion/toBoolean';
import ProductOrderJunction from './entities/product_order.entity';
import Cart from 'src/carts/entities/cart.entity';

@Injectable()
export class OrdersService {
  async create(user_extract: any, createOrderDto: CreateOrderDto) {
    try {
      const invoice_prefix = `GM-${user_extract.organizations[0].business_subtype
        ?.toUpperCase()
        .substring(0, 3)}-${user_extract.organizations[0].name
        ?.toUpperCase()
        .substring(0, 3)}-${user_extract.organizations[0].Employeeship?.branch
        .toUpperCase()
        .substring(0, 3)}`;
      const order = await Order.create(
        {
          ...createOrderDto,
          user_id: user_extract.id,
          invoice_prefix,
          invoice_id: '',
        },
        {
          fields: [
            'user_id',
            'invoice_prefix',
            'invoice_id',
            'recipient_name',
            'recipient_number',
            'recipient_email',
            'recipient_address',
            'delivery_fee',
            'discount',
            'registered_from',
          ],
        },
      );

      await ProductOrderJunction.bulkCreate(
        createOrderDto.product_list.map((product) => ({
          ...product,
          order_id: order.id,
        })),
        {
          fields: [
            'product_id',
            'order_id',
            'quantity',
            'unit_price',
            'total_price',
          ],
        },
      );

      await Cart.destroy({
        where: {
          id: createOrderDto.product_list.map((product) => product.cart_id),
        },
        force: true,
      });

      return {
        statusCode: 201,
        message: 'Orders placed successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async findAll(query: IPaginationQuery, user_id?: number) {
    const pagination = new Pagination(query);
    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops([
      'recipient_name',
      'recipient_number',
      'recipient_email',
    ]);
    const filters = pagination.format_filters({
      user_id,
    });
    return pagination.arrange(
      await Order.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          ...filters,
          ...trash_query,
        },
        include: [
          {
            association: 'user',
            attributes: ['id', 'first_name', 'last_name', 'username'],
          },
          {
            association: 'products',
            attributes: ['id', 'name', 'description', 'thumbnail_url'],
            through: {
              attributes: [
                'id',
                'product_id',
                'order_id',
                'quantity',
                'unit_price',
                'total_price',
              ],
            },
          },
        ],
        order,
        limit,
        offset,
        paranoid,
      }),
    );
  }

  async findOne(id: number) {
    try {
      const order = await Order.findByPk(id, {
        include: [
          {
            association: 'user',
            attributes: ['id', 'first_name', 'last_name', 'username'],
          },
          {
            association: 'products',
            include: [
              {
                association: 'brand',
              },
            ],
            attributes: [
              'id',
              'name',
              'description',
              'thumbnail_url',
              'unit_of_measure',
            ],
            through: {
              attributes: ['id', 'quantity', 'unit_price', 'total_price'],
            },
          },
        ],
        paranoid: false,
      });

      if (!order) {
        throw new NotFoundException(`Order not found`);
      }

      return {
        message: 'Order fetched successfully',
        data: order,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const {
        recipient_name,
        recipient_number,
        recipient_email,
        recipient_address,
        status,
        expected_delivery_date,
        delivery_fee,
        discount,
      } = updateOrderDto;

      const order = await Order.findByPk(id);

      if (!order) {
        throw new NotFoundException('Order not found');
      }
      await order.update({
        recipient_name,
        recipient_number,
        recipient_email,
        recipient_address,
        status,
        expected_delivery_date,
        delivery_fee,
        discount,
      });
      return {
        message: 'Order updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const order = await Order.findByPk(id, {
      paranoid: false,
    });

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    if (toBoolean(permanent)) {
      await order.destroy({ force: true });
      return {
        message: 'Order deleted permanently',
      };
    } else if (toBoolean(restore)) {
      if (order.deleted_at === null) {
        throw new BadRequestException(`Order not deleted`);
      }
      order.restore();
      return {
        message: 'Order restored successfully',
      };
    }

    await order.destroy();

    return {
      message: 'Order deleted successfully',
    };
  }
}
