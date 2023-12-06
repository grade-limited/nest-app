import { Injectable } from '@nestjs/common';
import { Includeable, Op } from 'sequelize';
// import { Sequelize } from 'sequelize-typescript';
import Category from 'src/categories/entities/category.entity';
// import Pagination from 'src/utils/Pagination';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';

@Injectable()
export class SearchService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getCategory(_query: IPaginationQuery) {
    // const pagination = new Pagination(query);
    // // const { limit, offset, paranoid, trash_query, order } =
    // //   pagination.get_attributes();
    // const search_ops = pagination.get_search_ops(['name']);
    return await Category.findAll({
      // where: {
      //   name: Sequelize.where(
      //     Sequelize.fn('LOWER', Sequelize.col('name')),
      //     'LIKE',
      //     `%${pagination.search_string.toLowerCase()}%`,
      //   ),
      // },
      where: {
        // [Op.or]: search_ops,
        parent_id: {
          [Op.eq]: null,
        },
      },
      include: this.decorate_include(20, []),
      // include: this.decorate_include(10),
      attributes: ['id', 'name', 'icon_url'],
    });
  }

  private decorate_include(more: number, prev?: Includeable[]) {
    if (more === 0) {
      return prev;
    }
    return this.decorate_include(more - 1, [
      {
        model: Category,
        as: 'children',
        attributes: ['id', 'name', 'icon_url'],
        include: prev,
      },
    ]);
  }
}
