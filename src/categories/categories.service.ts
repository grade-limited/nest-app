import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import Categories from './entities/category.entity';
import { Op } from 'sequelize';
import toBoolean from 'src/utils/conversion/toBoolean';

@Injectable()
export class CategoriesService {
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const {
        name,
        description,
        thumbnail_url,
        cover_url,
        icon_url,
        parent_id,
      } = createCategoryDto;
      await Categories.create({
        name,
        description,
        thumbnail_url,
        cover_url,
        icon_url,
        parent_id,
      });
      return {
        statusCode: 201,
        message: `${name} registered as a category successfully`,
      };
    } catch (error) {
      throw new BadRequestException(error?.errors?.[0]?.message || error);
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
      await Categories.findAndCountAll({
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
        paranoid,
        limit,
        offset,
      }),
    );
  }

  async findOne(id: number) {
    try {
      const category = await Categories.findByPk(id, {
        include: [
          {
            association: 'parent',
          },
        ],
        paranoid: false,
      });
      if (!category) {
        throw new NotFoundException(`category not found`);
      }
      return {
        message: 'category fetched successfully',
        data: category,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const {
        name,
        description,
        thumbnail_url,
        cover_url,
        icon_url,
        parent_id,
      } = updateCategoryDto;

      const category = await Categories.findByPk(id);
      if (!category) {
        throw new NotFoundException(`category not found`);
      }
      await category.update({
        name,
        description,
        thumbnail_url,
        cover_url,
        icon_url,
        parent_id,
      });
      return {
        message: 'category updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const category = await Categories.findByPk(id, {
      paranoid: false,
    });

    if (!category) {
      throw new NotFoundException(`category not found`);
    }

    if (toBoolean(permanent)) {
      await category.destroy({ force: true });
      return {
        message: 'category deleted permanently',
      };
    } else if (toBoolean(restore)) {
      if (category.deleted_at === null) {
        throw new BadRequestException(`category not deleted`);
      }
      await category.restore();
      return {
        message: 'category restored successfully',
      };
    }

    await category.destroy();

    return {
      message: 'category deleted successfully',
    };
  }
}
