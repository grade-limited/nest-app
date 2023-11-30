import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';
import User from './entities/user.entity';
import toBoolean from 'src/utils/conversion/toBoolean';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    if (createUserDto.primary_contact === 'phone' && !createUserDto.phone)
      throw new BadRequestException('Please provide phone number.');

    if (createUserDto.primary_contact === 'email' && !createUserDto.email)
      throw new BadRequestException('Please provide email address.');

    if (!createUserDto.password)
      throw new BadRequestException('Please provide password.');

    const ref_user = createUserDto.referral_code
      ? await User.findOne({
          where: {
            referral_code: createUserDto.referral_code,
          },
          paranoid: false,
        })
      : null;

    try {
      await User.create(
        {
          ...createUserDto,
          ...(ref_user && {
            referred_by_id: ref_user.id,
          }),
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
            'address',
            'registered_from',
            'referral_code',
            'referred_by_id',
          ],
        },
      );
      // SEND OTP HERE
      return {
        message: `A user created with ${
          createUserDto.primary_contact === 'phone'
            ? createUserDto.phone
            : createUserDto.email
        }.`,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to create user',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

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
        attributes: {
          exclude: ['password'],
        },
        order,
        limit,
        offset,
        paranoid,
      }),
    );
  }

  async findOne(id: number) {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ['password'],
      },
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
