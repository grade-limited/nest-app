import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import Address from './entities/address.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import toBoolean from 'src/utils/conversion/toBoolean';

@Injectable()
export class AddressesService {
  async create(user_extract: any, createAddressDto: CreateAddressDto) {
    try {
      const address = await Address.create(
        {
          ...createAddressDto,
          user_id: user_extract.id,
        },
        {
          fields: ['description', 'label'],
        },
      );
      return {
        statuscode: 201,
        message: ` Address Saved successfully`,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.error?.[0]?.message || error?.message || error,
      );
    }
  }

  async findAll(query: IPaginationQuery, user_id?: number) {
    const pagination = new Pagination(query);
    const { trash_query } = pagination.get_attributes();

    const filters = pagination.format_filters({
      user_id,
    });
    return pagination.arrange(
      await Address.findAndCountAll({
        where: {
          ...filters,
          ...trash_query,
        },
      }),
    );
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    try {
      const { description, label } = updateAddressDto;

      const address = await Address.findByPk(id);

      if (!address) {
        throw new NotFoundException('Address Not Fount');
      }
      await address.update({
        description,
        label,
      });
      return {
        message: 'Address Updated Successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const address = await Address.findByPk(id, {
      paranoid: false,
    });

    if (!address) {
      throw new NotFoundException(`Address not found`);
    }

    if (toBoolean(permanent)) {
      await address.destroy({ force: true });
      return {
        message: 'Address deleted permanently',
      };
    } else if (toBoolean(restore)) {
      if (address.deleted_at === null) {
        throw new BadRequestException(`Address not deleted`);
      }
      address.restore();
      return {
        message: 'Address restored successfully',
      };
    }

    await address.destroy();

    return {
      message: 'Address deleted successfully',
    };
  }
}
