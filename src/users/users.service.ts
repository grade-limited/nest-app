import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';
import User from './entities/user.entity';
import toBoolean from 'src/utils/conversion/toBoolean';

@Injectable()
export class UsersService {
  async findAll(query: IPaginationQuery) {
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

    // // get filter props
    // const filters = pagination.format_filters({
    //   role_id: role,
    // });

    return pagination.arrange(
      await User.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          // ...filters,
          ...trash_query,
        },
        include: [
          {
            association: 'referred_by',
            attributes: [
              'id',
              'first_name',
              'last_name',
              'username',
              'display_picture',
            ],
          },
        ],
        order,
        limit,
        offset,
        paranoid,
      }),
    );
  }

  async findOne(id: number) {
    const user = await User.findByPk(id, {
      paranoid: false,
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return {
      message: 'Information fetched successfully',
      data: user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const {
      first_name,
      last_name,
      gender,
      dob,
      address,
      phone,
      email,
      display_picture,
      max_session,
    } = updateUserDto;

    const user = await User.findByPk(id, {});

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    await user.update({
      first_name,
      last_name,
      gender,
      dob,
      address,
      phone,
      email,
      display_picture,
      max_session,
    });

    return {
      message: 'Information updated successfully',
    };
  }

  public async activeInactive(id: number) {
    {
      const user = await User.findByPk(id, {});

      if (!user) {
        throw new NotFoundException('No user found!');
      }

      await user.update({
        is_active: !user.is_active,
      });
      await user.save();

      return {
        message: `User ${
          !user.is_active ? 'suspended' : 'activated'
        } successfully`,
      };
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const user = await User.findByPk(id, {
      paranoid: false,
    });

    if (!user) {
      throw new NotFoundException('No user found!');
    }

    if (toBoolean(permanent)) {
      await user.destroy({ force: true });
      return {
        message: 'User deleted successfully',
      };
    } else if (toBoolean(restore)) {
      if (!user.deleted_at) throw new BadRequestException('User not deleted');

      await user.restore();
      return {
        message: 'User restored successfully',
      };
    }

    await user.destroy();

    return {
      message: 'User deleted successfully',
    };
  }
}
