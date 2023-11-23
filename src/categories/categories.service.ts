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

@Injectable()
export class CategoriesService {
  async create(createCategoryDto: CreateCategoryDto) {
    const { name, description, thumbnail_url, cover_url, icon_url, parent_id } =
      createCategoryDto;
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
  }

  async findAll(query: IPaginationQuery, parent_id?: number) {
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
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name, description, thumbnail_url, cover_url, icon_url, parent_id } =
      updateCategoryDto;

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
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const category = await Categories.findByPk(id, {
      paranoid: false,
    });

    if (!category) {
      throw new NotFoundException(`category not found`);
    }

    if (permanent) {
      await category.destroy({ force: true });
      return {
        message: 'category deleted permanently',
      };
    } else if (restore) {
      if (category.deleted_at === null) {
        throw new BadRequestException(`category not deleted`);
      }
      category.restore();
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
