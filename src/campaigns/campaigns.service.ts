import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import Campaign from './entities/campaign.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';
import toBoolean from 'src/utils/conversion/toBoolean';

@Injectable()
export class CampaignsService {
  async create(createCampaignDto: CreateCampaignDto) {
    try {
      const {
        name,
        description,
        cover_url,
        thumbnail_url,
        is_active,
        publish_date,
        start_date,
        end_date,
        amount,
        amount_type,
        campaign_type,
        campaign_url,
      } = createCampaignDto;

      await Campaign.create({
        name,
        description,
        cover_url,
        thumbnail_url,
        is_active,
        publish_date,
        start_date,
        end_date,
        amount,
        amount_type,
        campaign_type,
        campaign_url,
      });

      return {
        statusCode: 201,
        message: `${name} campaign registered successfully`,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async findAll(query: IPaginationQuery, is_active?: string) {
    const pagination = new Pagination(query);
    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops(['name']);
    const filters = pagination.format_filters({
      is_active,
    });
    return pagination.arrange(
      await Campaign.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          ...filters,
          ...trash_query,
        },
        order,
        limit,
        offset,
        paranoid,
      }),
    );
  }

  async findOne(id: number) {
    try {
      const campaign = await Campaign.findByPk(id, {
        paranoid: false,
      });

      if (!campaign) {
        throw new NotFoundException(`Campaign not found`);
      }

      return {
        message: 'Campaign fetched successfully',
        data: campaign,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async update(id: number, updateCampaignDto: UpdateCampaignDto) {
    try {
      const {
        name,
        description,
        cover_url,
        thumbnail_url,
        is_active,
        publish_date,
        start_date,
        end_date,
        amount,
        amount_type,
        campaign_type,
        campaign_url,
      } = updateCampaignDto;

      const campaign = await Campaign.findByPk(id);

      if (!campaign) {
        throw new NotFoundException('Campaign not found');
      }
      await campaign.update({
        name,
        description,
        cover_url,
        thumbnail_url,
        is_active,
        publish_date,
        start_date,
        end_date,
        amount,
        amount_type,
        campaign_type,
        campaign_url,
      });
      return {
        message: 'Campaign updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async addOrRemoveProducts(id: number, products: number[], action: string) {
    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (!action || !['add', 'remove'].includes(action)) {
      throw new BadRequestException('Invalid action');
    }

    if (action === 'add') {
      await campaign.$add('products', products);
    } else {
      await campaign.$remove('products', products, {
        force: true,
      });
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const campaign = await Campaign.findByPk(id, {
      paranoid: false,
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign not found`);
    }

    if (toBoolean(permanent)) {
      await campaign.destroy({ force: true });
      return {
        message: 'Campaign deleted permanently',
      };
    } else if (toBoolean(restore)) {
      if (campaign.deleted_at === null) {
        throw new BadRequestException(`Campaign not deleted`);
      }
      campaign.restore();
      return {
        message: 'Campaign restored successfully',
      };
    }

    await campaign.destroy();

    return {
      message: 'Campaign deleted successfully',
    };
  }
}
