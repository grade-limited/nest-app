import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import Permission from './entities/permission.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';

@Injectable()
export class PermissionsService {
  async create(createPermissionDto: CreatePermissionDto) {
    try {
      await Permission.create(
        {
          ...createPermissionDto,
        },
        {
          fields: ['role_id', 'access_point_id', 'type'],
        },
      );
      return {
        statusCode: 201,
        message: `permitted successfully`,
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

  async findAll(query: IPaginationQuery, role?: number, access_point?: number) {
    const pagination = new Pagination(query);

    // get query props
    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    // get filter props
    const filters = pagination.format_filters({
      role_id: role,
      access_point_id: access_point,
    });

    return pagination.arrange(
      await Permission.findAndCountAll({
        where: {
          ...filters,
          ...trash_query,
        },
        // include: {
        //   model: Role,
        //   as: 'role',
        //   attributes: ['id', 'name'],
        // },
        limit,
        order,
        offset,
        paranoid,
      }),
    );
  }

  async findOne(id: number) {
    const permission = await Permission.findByPk(id, {});

    if (!permission) {
      throw new NotFoundException(`Permission not found`);
    }

    return {
      statusCode: 200,
      message: 'Information fetched successfully',
      data: permission,
    };
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      const { role_id, access_point_id, type } = updatePermissionDto;

      const permission = await Permission.findByPk(id, {});

      if (!permission) throw new NotFoundException(`Permission not found`);

      await permission.update({
        role_id,
        access_point_id,
        type,
      });

      return {
        statusCode: 204,
        message: 'Information updated successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to update permission',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
