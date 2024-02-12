import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrgOrderDto } from './dto/create-org_order.dto';
import { UpdateOrgOrderDto } from './dto/update-org_order.dto';
import OrgOrder from './entities/org_order.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';
import toBoolean from 'src/utils/conversion/toBoolean';
import ProductOrgOrderJunction from './entities/product_org_order_junction.entity';

@Injectable()
export class OrgOrdersService {
  async create(
    user_extract: any,
    organization_extract: any,
    createOrgOrderDto: CreateOrgOrderDto,
  ) {
    try {
      const orgOrder = await OrgOrder.create(
        {
          ...createOrgOrderDto,
          user_id: user_extract.id,
          organization_id: organization_extract.id,
        },
        {
          fields: [
            'user_id',
            'recipient_name',
            'recipient_number',
            'recipient_email',
            'recipient_address',
            'delivery_fee',
            'discount',
            'registered_from',
            'organization_id',
          ],
        },
      );

      await ProductOrgOrderJunction.bulkCreate(
        createOrgOrderDto.product_list.map((product) => ({
          ...product,
          orgorder_id: orgOrder.id,
        })),
        {
          fields: [
            'product_id',
            'orgorder_id',
            'quantity',
            'unit_price',
            'total_price',
          ],
        },
      );
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async findAll(
    query: IPaginationQuery,
    user_id?: number,
    organization_id?: number,
  ) {
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
      organization_id,
    });
    return pagination.arrange(
      await OrgOrder.findAndCountAll({
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
                'orgorder_id',
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
      const orgOrder = await OrgOrder.findByPk(id, {
        include: [
          {
            association: 'user',
            attributes: ['id', 'first_name', 'last_name', 'username'],
          },
          {
            association: 'products',
            attributes: ['id', 'name', 'description', 'thumbnail_url'],
            through: {
              attributes: ['id', 'quantity', 'unit_price', 'total_price'],
            },
          },
        ],
        paranoid: false,
      });

      if (!orgOrder) {
        throw new NotFoundException(`Organization's Order not found`);
      }

      return {
        message: `Organization's Order not found fetched successfully`,
        data: orgOrder,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async update(id: number, updateOrgOrderDto: UpdateOrgOrderDto) {
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
      } = updateOrgOrderDto;

      const orgOrder = await OrgOrder.findByPk(id);

      if (!orgOrder) {
        throw new NotFoundException(`Organization's Order not found`);
      }
      await orgOrder.update({
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
        message: `Organization's Order updated successfully`,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const orgOrder = await OrgOrder.findByPk(id, {
      paranoid: false,
    });

    if (!orgOrder) {
      throw new NotFoundException(`Organization's Order not found`);
    }

    if (toBoolean(permanent)) {
      await orgOrder.destroy({ force: true });
      return {
        message: `Organization's Order deleted permanently`,
      };
    } else if (toBoolean(restore)) {
      if (orgOrder.deleted_at === null) {
        throw new BadRequestException(`Organization's Order not deleted`);
      }
      orgOrder.restore();
      return {
        message: `Organization's Order successfully`,
      };
    }

    await orgOrder.destroy();

    return {
      message: `Organization's Order deleted successfully`,
    };
  }
}
