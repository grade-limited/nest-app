import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';
import Brand from './entities/brand.entity';
import toBoolean from 'src/utils/conversion/toBoolean';

@Injectable()
export class BrandsService {
  async create(createChapterDto: CreateBrandDto) {
    try {
      const { name, description, thumbnail_url, cover_url, parent_id } =
        createChapterDto;

      await Brand.create({
        name,
        description,
        thumbnail_url,
        cover_url,
        parent_id,
      });
      return {
        statusCode: 201,
        message: `${name} registered as a Brand successfully`,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async findAll(
    query: IPaginationQuery,
    parent_id?: number,
    only_parent?: boolean,
  ) {
    const pagination = new Pagination(query);

    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops(['name']);
    const filters = pagination.format_filters({
      parent_id,
    });

    return pagination.arrange(
      await Brand.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          ...filters,
          ...trash_query,

          ...(toBoolean(only_parent)
            ? {
                parent_id: { [Op.eq]: null },
              }
            : {}),
        },
        include: [
          {
            association: 'parent',
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
      const brand = await Brand.findByPk(id, {
        include: [
          {
            association: 'parent',
          },
        ],
        paranoid: false,
      });

      if (!brand) {
        throw new NotFoundException(`Brand not found`);
      }

      return {
        message: 'Information fetched successfully',
        data: brand,
      };
    } catch (error) {
      throw new BadRequestException(error?.errors?.[0]?.message || error);
    }
  }
  async update(id: number, updateBrandDto: UpdateBrandDto) {
    try {
      const { name, description, thumbnail_url, cover_url, parent_id } =
        updateBrandDto;

      const brand = await Brand.findByPk(id, {});

      if (!brand) {
        throw new NotFoundException(`Brand not found`);
      }

      await brand.update({
        name,
        description,
        thumbnail_url,
        cover_url,
        parent_id,
      });

      return {
        message: 'Information updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const brand = await Brand.findByPk(id, {
      paranoid: false,
    });

    if (!brand) {
      throw new NotFoundException('No brand found!');
    }

    if (toBoolean(permanent)) {
      await brand.destroy({ force: true });
      return {
        message: 'Brand deleted permanently',
      };
    } else if (toBoolean(restore)) {
      if (!brand.deleted_at) throw new BadRequestException('Brand not deleted');

      await brand.restore();
      return {
        message: 'Brand restored successfully',
      };
    }

    await brand.destroy();

    return {
      message: 'Brand deleted successfully',
    };
  }
}
