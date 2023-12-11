import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeshipDto } from './dto/create-employeeship.dto';
import { UpdateEmployeeshipDto } from './dto/update-employeeship.dto';
import Employeeship from './entities/employeeship.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import toBoolean from 'src/utils/conversion/toBoolean';

@Injectable()
export class EmployeeshipsService {
  async create(createEmployeeshipDto: CreateEmployeeshipDto) {
    try {
      await Employeeship.create(
        {
          ...createEmployeeshipDto,
        },
        {
          fields: [
            'user_id',
            'organization_id',
            'employeeship_status',
            'employee_id',
            'depertment',
            'designation',
            'desk_info',
            'business_unit',
            'is_kam',
          ],
        },
      );
      return {
        statusCode: 201,
        message: `Registered as a employeeship successfully`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to permit',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  async findAll(
    query: IPaginationQuery,
    user_id?: number,
    organization_id?: number,
    employeeship_status?: string,
  ) {
    const pagination = new Pagination(query);
    // get query props
    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    // get filter props
    const filters = pagination.format_filters({
      user_id,
      organization_id,
      employeeship_status,
    });

    return pagination.arrange(
      await Employeeship.findAndCountAll({
        where: {
          ...filters,
          ...trash_query,
        },
        include: [
          {
            association: 'user',
            attributes: ['id', 'first_name', 'last_name', 'username'],
          },
          {
            association: 'organization',
          },
        ],
        limit,
        order,
        offset,
        paranoid,
      }),
    );
  }

  async findOne(id: number) {
    const employeeship = await Employeeship.findByPk(id, {
      include: [
        {
          association: 'user',
          attributes: ['id', 'first_name', 'last_name', 'username'],
        },
        {
          association: 'organization',
        },
      ],
    });

    if (!employeeship) {
      throw new NotFoundException(`Employeeship not found`);
    }

    return {
      statusCode: 200,
      message: 'Information fetched successfully',
      data: employeeship,
    };
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeshipDto) {
    try {
      const {
        employee_id,
        depertment,
        designation,
        branch,
        desk_info,
        business_unit,
        employeeship_status,
        is_kam,
      } = updateEmployeeDto;

      const employeeship = await Employeeship.findByPk(id, {});

      if (!employeeship) throw new NotFoundException(`Employeeship not found`);

      await employeeship.update({
        employee_id,
        depertment,
        designation,
        branch,
        desk_info,
        business_unit,
        employeeship_status,
        is_kam,
      });

      return {
        statusCode: 204,
        message: 'Information updated successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to update employeeship',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const employeeship = await Employeeship.findByPk(id, {
      paranoid: false,
    });

    if (!employeeship) {
      throw new NotFoundException(`Employeeship not found`);
    }

    if (toBoolean(permanent)) {
      await employeeship.destroy({ force: true });
      return {
        message: 'Employeeship is deleted permanently',
      };
    } else if (toBoolean(restore)) {
      if (employeeship.deleted_at === null) {
        throw new BadRequestException(`Employeeship is not deleted`);
      }
      employeeship.restore();
      return {
        message: 'Employeeship is restored successfully',
      };
    }

    await employeeship.destroy();

    return {
      message: 'Employeeship deleted successfully',
    };
  }
}
