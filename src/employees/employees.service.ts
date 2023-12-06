import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import Employee from './entities/employee.entity';
import Pagination from 'src/utils/Pagination';
import Role from 'src/roles/entities/role.entity';
import { Op } from 'sequelize';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import { nanoid } from 'nanoid';
import toBoolean from 'src/utils/conversion/toBoolean';

@Injectable()
export class EmployeesService {
  async create_username(name: string) {
    const id = (await Employee.findOne({
      where: { username: name },
      paranoid: false,
    }))
      ? `.${nanoid(3)}`
      : '';

    const username = `${name.toLowerCase().replace(/\s/g, '')}${id}`;
    while (await Employee.findOne({ where: { username } })) {
      return this.create_username(name);
    }
    return username;
  }

  async create(data: CreateEmployeeDto) {
    try {
      await Employee.create(
        {
          ...data,
          username: await this.create_username(data.last_name),
        },
        {
          fields: [
            'first_name',
            'last_name',
            'username',
            'password',
            'gender',
            'email',
            'phone',
            'dob',
            'display_picture',
            'address',
            'max_session',
            'role_id',
          ],
        },
      );
      return {
        message: `${data.first_name} registered as an employee successfully`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to create employee',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  async findAll(query: IPaginationQuery, role?: number) {
    const pagination = new Pagination(query);

    // get query props
    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    // get search object
    const search_ops = pagination.get_search_ops([
      'first_name',
      'last_name',
      'username',
      'phone',
      'email',
      'address',
    ]);

    // get filter props
    const filters = pagination.format_filters({
      role_id: role,
    });

    return pagination.arrange(
      await Employee.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          ...filters,
          ...trash_query,
        },
        include: {
          model: Role,
          as: 'role',
          attributes: ['id', 'name', 'prefix'],
        },
        attributes: {
          exclude: ['password', 'role_id'],
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
      const employee = await Employee.findByPk(id, {
        include: {
          model: Role,
          as: 'role',
          attributes: ['id', 'name', 'prefix'],
        },
        attributes: {
          exclude: ['password'],
        },
        paranoid: false,
      });

      if (!employee) {
        throw new NotFoundException(`Employee not found`);
      }

      return {
        message: 'Information fetched successfully',
        data: employee,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const {
        first_name,
        last_name,
        gender,
        email,
        dob,
        role_id,
        address,
        max_session,
        display_picture,
      } = updateEmployeeDto;

      const employee = await Employee.findByPk(id, {});

      if (!employee) {
        throw new NotFoundException(`Employee not found`);
      }

      await employee.update({
        first_name,
        last_name,
        gender,
        email,
        dob,
        role_id,
        address,
        max_session,
        display_picture,
      });

      return {
        message: 'Information updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  public async activeInactive(id: number) {
    {
      const employee = await Employee.findByPk(id, {});

      if (!employee) {
        throw new NotFoundException('No employee found!');
      }

      await employee.update({
        is_active: !employee.is_active,
      });
      await employee.save();

      return {
        message: `Employee ${
          !employee.is_active ? 'suspended' : 'activated'
        } successfully`,
      };
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const employee = await Employee.findByPk(id, {
      paranoid: false,
    });

    if (!employee) {
      throw new NotFoundException(`Employee not found`);
    }

    if (toBoolean(permanent)) {
      employee.destroy({ force: true });
      return {
        message: `Employee deleted permanently.`,
      };
    } else if (toBoolean(restore)) {
      if (employee.deleted_at === null)
        throw new BadRequestException(`Employee not deleted`);
      employee.restore();
      return {
        message: 'Employee restored successfully',
      };
    }

    await employee.destroy();

    return {
      message: 'Employee deleted successfully',
    };
  }
}
