import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import Request from './entities/request.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';
import toBoolean from 'src/utils/conversion/toBoolean';
import { request } from 'http';

@Injectable()
export class RequestsService {
  async create(createRequestDto: CreateRequestDto) {
    try {
      const {
        organization_name,
        business_type,
        business_subtype,
        contact_number,
        contact_email,
        contact_address,
        website_url,
        linkedin_url,
        facebook_url,
        instagram_url,
        contact_person_name,
        contact_person_phone,
        contact_person_address,
        contact_person_employee_id,
        contact_person_dept,
        contact_person_designation,
        contact_person_branch,
        contact_person_desk_information,
        contact_person_business_unit,
        request_status,
      } = createRequestDto;

      await Request.create({
        organization_name,
        business_type,
        business_subtype,
        contact_number,
        contact_email,
        contact_address,
        website_url,
        linkedin_url,
        facebook_url,
        instagram_url,
        contact_person_name,
        contact_person_phone,
        contact_person_address,
        contact_person_employee_id,
        contact_person_dept,
        contact_person_designation,
        contact_person_branch,
        contact_person_desk_information,
        contact_person_business_unit,
        request_status,
      });
      return {
        statusCode: 201,
        message: `${organization_name} requested successfully`,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async findAll(query: IPaginationQuery, business_type?: string) {
    const pagination = new Pagination(query);
    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops([
      'organization_name',
      'contact_number',
      'contact_email',
    ]);
    const filters = pagination.format_filters({
      business_type,
    });
    return pagination.arrange(
      await Request.findAndCountAll({
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
      const request = await Request.findByPk(id, {
        paranoid: false,
      });

      if (!request) {
        throw new NotFoundException(`Request not found`);
      }

      return {
        message: 'Request fetched successfully',
        data: request,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async update(id: number, updateRequestDto: UpdateRequestDto) {
    try {
      const {
        organization_name,
        business_type,
        business_subtype,
        contact_number,
        contact_email,
        contact_address,
        website_url,
        linkedin_url,
        facebook_url,
        instagram_url,
        contact_person_name,
        contact_person_phone,
        contact_person_address,
        contact_person_employee_id,
        contact_person_dept,
        contact_person_designation,
        contact_person_branch,
        contact_person_desk_information,
        contact_person_business_unit,
        request_status,
      } = updateRequestDto;

      const request = await Request.findByPk(id);
      if (!request) {
        throw new NotFoundException('Organization not found');
      }
      await request.update({
        organization_name,
        business_type,
        business_subtype,
        contact_number,
        contact_email,
        contact_address,
        website_url,
        linkedin_url,
        facebook_url,
        instagram_url,
        contact_person_name,
        contact_person_phone,
        contact_person_address,
        contact_person_employee_id,
        contact_person_dept,
        contact_person_designation,
        contact_person_branch,
        contact_person_desk_information,
        contact_person_business_unit,
        request_status,
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
    const request = await Request.findByPk(id, {
      paranoid: false,
    });

    if (!request) {
      throw new NotFoundException(`Request not found`);
    }

    if (toBoolean(permanent)) {
      await request.destroy({ force: true });
      return {
        message: 'Request deleted permanently',
      };
    } else if (toBoolean(restore)) {
      if (request.deleted_at === null) {
        throw new BadRequestException(`Request not deleted`);
      }
      request.restore();
      return {
        message: 'Request restored successfully',
      };
    }

    await request.destroy();

    return {
      message: 'Request deleted successfully',
    };
  }
}
