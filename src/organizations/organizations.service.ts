import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import Organization from './entities/organization.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';
import toBoolean from 'src/utils/conversion/toBoolean';

@Injectable()
export class OrganizationsService {
  async create(createOrganizationDto: CreateOrganizationDto) {
    try {
      const {
        name,
        contact_number,
        contact_email,
        business_type,
        business_subtype,
        website_url,
        linkedin_url,
        facebook_url,
        instagram_url,
      } = createOrganizationDto;

      await Organization.create({
        name,
        contact_number,
        contact_email,
        business_type,
        business_subtype,
        website_url,
        linkedin_url,
        facebook_url,
        instagram_url,
      });
      return {
        statusCode: 201,
        message: `${name} Registered as a organization successfully`,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async findAll(
    query: IPaginationQuery,
    //name?: string,
    business_type?: string,
  ) {
    const pagination = new Pagination(query);
    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops([
      'name',
      'contact_number',
      'contact_email',
    ]);
    const filters = pagination.format_filters({
      // name,
      business_type,
    });
    return pagination.arrange(
      await Organization.findAndCountAll({
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
      const organization = await Organization.findByPk(id, {
        paranoid: false,
      });

      if (!organization) {
        throw new NotFoundException(`User not found`);
      }

      return {
        message: 'organization fetched successfully',
        data: organization,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    try {
      const {
        name,
        contact_number,
        contact_email,
        business_type,
        business_subtype,
        website_url,
        linkedin_url,
        facebook_url,
        instagram_url,
      } = updateOrganizationDto;

      const organization = await Organization.findByPk(id);

      if (!organization) {
        throw new NotFoundException('Not found Organization');
      }
      await organization.update({
        name,
        contact_number,
        contact_email,
        business_type,
        business_subtype,
        website_url,
        linkedin_url,
        facebook_url,
        instagram_url,
      });
      return {
        message: 'organization updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const organization = await Organization.findByPk(id, {
      paranoid: false,
    });

    if (!organization) {
      throw new NotFoundException(`organization not found`);
    }

    if (toBoolean(permanent)) {
      await organization.destroy({ force: true });
      return {
        message: 'organization deleted permanently',
      };
    } else if (toBoolean(restore)) {
      if (organization.deleted_at === null) {
        throw new BadRequestException(`Organization not deleted`);
      }
      organization.restore();
      return {
        message: 'organization restored successfully',
      };
    }

    await organization.destroy();

    return {
      message: 'Organization deleted successfully',
    };
  }
}
