import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import Newsletter from './entities/newsletter.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';
import toBoolean from 'src/utils/conversion/toBoolean';

@Injectable()
export class NewslettersService {
  async create(createNewsletterDto: CreateNewsletterDto) {
    try {
      await Newsletter.create(
        {
          ...createNewsletterDto,
        },
        {
          fields: ['email'],
        },
      );
      return {
        statusCode: 201,
        message: `Subscription Created successfully`,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async findAll(query: IPaginationQuery) {
    const pagination = new Pagination(query);
    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops(['email']);
    return pagination.arrange(
      await Newsletter.findAll({
        where: {
          [Op.or]: search_ops,
          ...trash_query,
        },
        order,
        limit,
        offset,
        paranoid,
      }),
    );
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const newsletter = await Newsletter.findByPk(id, {
      paranoid: false,
    });

    if (!newsletter) {
      throw new NotFoundException(`Subscribed to GRADE BD`);
    }

    if (toBoolean(permanent)) {
      await newsletter.destroy({ force: true });
      return {
        message: 'Subscription deleted permanently',
      };
    } else if (toBoolean(restore)) {
      if (newsletter.deleted_at === null) {
        throw new BadRequestException(`Subscription not deleted`);
      }
      newsletter.restore();
      return {
        message: 'Subscription restored successfully',
      };
    }

    await newsletter.destroy();

    return {
      message: 'Subscription deleted successfully',
    };
  }
}
