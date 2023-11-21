import { HttpException, HttpStatus } from '@nestjs/common';
import { Op, Order, literal } from 'sequelize';
import { IPaginationQuery } from './dto/query.dto';

class Pagination {
  public search_string?: string;
  public page = 0;
  public limit = 10;
  public skip = 0;
  public show_paranoid = true;
  public sort?: string;
  public literal_fields: string[] = [];
  public is_trash?: boolean;
  public trash_query?: any;

  constructor(query: IPaginationQuery, literal_fields: string[] = []) {
    try {
      const { search, limit, page, sort, show_paranoid, trash } = query;
      this.sort = sort ? this.replaceAll(sort?.toString(), ' ', '') : undefined;
      this.limit =
        limit && parseInt(limit?.toString()) ? parseInt(limit?.toString()) : 10;
      this.search_string = search?.toString() || '';
      this.page =
        page && parseInt(page?.toString() || '0') > 1
          ? parseInt(page?.toString() || '0')
          : 1;
      this.skip = (this.page - 1) * this.limit;
      this.literal_fields = literal_fields;

      this.is_trash =
        trash !== null && trash !== undefined ? this.toBoolean(trash) : false;

      this.show_paranoid = this.is_trash
        ? false
        : show_paranoid !== null && show_paranoid !== undefined
        ? this.toBoolean(show_paranoid)
        : true;

      this.trash_query = this.is_trash ? { deleted_at: { [Op.ne]: null } } : {};
    } catch (_err: any) {
      throw new HttpException(
        'problem constructing pagination',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.replaceAll = this.replaceAll.bind(this);
    this.order = this.order.bind(this);
    this.get_attributes = this.get_attributes.bind(this);
    this.get_search_ops = this.get_search_ops.bind(this);
    this.format_filters = this.format_filters.bind(this);
    this.arrange = this.arrange.bind(this);
  }

  private replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  public order(literal_fields: string[] | undefined = []) {
    if (!this.sort) return [];
    literal_fields = literal_fields.concat(this.literal_fields);

    return Array.from(this.sort.split(' '), (s: string) =>
      s[0] === '-'
        ? [
            literal_fields.includes(s.replace('-', ''))
              ? literal(s.replace('-', ''))
              : s.replace('-', ''),
            'ASC',
          ]
        : [literal_fields.includes(s) ? literal(s) : s, 'DESC'],
    );
  }

  public get_attributes(literal_fields: string[] | undefined = []) {
    return {
      offset: this.skip,
      limit: this.limit,
      order: this.order(literal_fields) as Order,
      paranoid: this.show_paranoid,
      trash_query: this.trash_query,
      is_trash: this.is_trash,
    };
  }

  public get_search_ops(search_fields: string[] = []): {
    [x: string]: {
      [Op.like]: string;
    };
  }[] {
    return Array.from(search_fields, (f: string) => ({
      [f]: {
        [Op.like]: `%${this.search_string}%`,
      },
    }));
  }

  public format_filters(filter_object: { [key: string]: any }) {
    const output_object: { [key: string]: any } = {};
    for (const key in filter_object) {
      if (filter_object[key] !== null && filter_object[key] !== undefined) {
        output_object[key] = filter_object[key];
      }
    }
    return output_object;
  }

  public arrange(data: any) {
    return {
      success: true,
      message: 'Data fetched sucessfully',
      data: data.rows,
      total: data.count,
      limit: this.limit,
      page: this.page,
      has_next_page: Math.ceil(data.count / this.limit) - this.page > 0,
      has_previous_page: this.page > 1,
      total_pages: Math.ceil(data.count / this.limit),
      showing_soft_deleted: !this.show_paranoid,
    };
  }

  public toBoolean(value: any) {
    return value !== null && value !== undefined
      ? ['true', 'True', true, 1].includes(value)
        ? true
        : ['false', 'False', false, 0].includes(value)
        ? false
        : undefined
      : undefined;
  }
}

export default Pagination;
