import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import Category from 'src/categories/entities/category.entity';
import Pagination from 'src/utils/Pagination';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';

@Injectable()
export class SearchService {
  async getCategory(query: IPaginationQuery) {
    const pagination = new Pagination(query);

    const { limit, offset, paranoid, trash_query, order, search_string } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops(['name']);

    return await Category.findAll({
      where: {
        name: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('name')),
          'LIKE',
          `%${search_string.toLowerCase()}%`,
        ),
      },
      include: [
        {
          model: Category,
          as: 'children',
          hierarchy: true,
        },
      ],
      hierarchy: true,
    });
  }

  private mapCategoryToResult(category: Category): any {
    const result: any = { name: category.name };

    if (category.children && category.children.length > 0) {
      result.children = category.children.map((child) =>
        this.mapCategoryToResult(child),
      );
    } else {
      result.children = [];
    }

    return result;
  }
}
