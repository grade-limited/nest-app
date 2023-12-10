import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import Quotation from './entities/quotation.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';
import toBoolean from 'src/utils/conversion/toBoolean';
import ProductQuotationJunction from './entities/product_quotation.entity';

@Injectable()
export class QuotationsService {
  async create(user_extract: any, createquotationDto: CreateQuotationDto) {
    try {
      const quotation = await Quotation.create(
        {
          ...createquotationDto,
          user_id: user_extract.id,
        },
        {
          fields: [
            'user_id',
            'contact_name',
            'contact_number',
            'contact_email',
            'contact_designation',
          ],
        },
      );

      await ProductQuotationJunction.bulkCreate(
        createquotationDto.product_list.map((product) => ({
          ...product,
          quotation_id: quotation.id,
        })),
        {
          fields: [
            'product_id',
            'quotation_id',
            'quantity',
            'is_customized',
            'requirments',
            'attachments',
          ],
        },
      );

      return {
        statusCode: 201,
        message: `Quotation Created successfully`,
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
      'contact_name',
      'contact_number',
      'contact_email',
    ]);
    const filters = pagination.format_filters({
      user_id,
    });
    return pagination.arrange(
      await Quotation.findAndCountAll({
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
            attributes: ['id', 'name', 'description', 'price'],
            through: {
              attributes: ['id', 'quantity', 'is_customized', 'requirments'],
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
      const quotation = await Quotation.findByPk(id, {
        include: [
          {
            association: 'user',
            attributes: ['id', 'first_name', 'last_name', 'username'],
          },
          {
            association: 'products',
            attributes: ['id', 'name', 'description', 'price'],
            through: {
              attributes: ['id', 'quantity', 'is_customized', 'requirments'],
            },
          },
        ],
        paranoid: false,
      });

      if (!quotation) {
        throw new NotFoundException(`Quotation not found`);
      }

      return {
        message: 'Quotation fetched successfully',
        data: quotation,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async update(id: number, updateQuotationDto: UpdateQuotationDto) {
    try {
      const { status } = updateQuotationDto;

      const quotation = await Quotation.findByPk(id);

      if (!quotation) {
        throw new NotFoundException('Quotation not found');
      }
      await quotation.update({
        status,
      });
      return {
        message: 'Quotation updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const quotation = await Quotation.findByPk(id, {
      paranoid: false,
    });

    if (!quotation) {
      throw new NotFoundException(`Quotation not found`);
    }

    if (toBoolean(permanent)) {
      await quotation.destroy({ force: true });
      return {
        message: 'Quotation deleted permanently',
      };
    } else if (toBoolean(restore)) {
      if (quotation.deleted_at === null) {
        throw new BadRequestException(`Quotation not deleted`);
      }
      quotation.restore();
      return {
        message: 'Quotation restored successfully',
      };
    }

    await quotation.destroy();

    return {
      message: 'Quotation deleted successfully',
    };
  }
}
