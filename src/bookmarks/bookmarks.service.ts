import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import Bookmark from './entities/bookmark.entity';
import toBoolean from 'src/utils/conversion/toBoolean';

@Injectable()
export class BookmarksService {
  async create(createBookmarkDto: CreateBookmarkDto) {
    try {
      await Bookmark.create(
        {
          ...createBookmarkDto,
        },
        {
          fields: ['user_id', 'product_id'],
        },
      );
      return {
        statusCode: 201,
        message: `Product bookmarked successfully`,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async findAll(user_extract: any) {
    return await Bookmark.findAll({
      where: {
        user_id: user_extract.id,
      },
      include: [
        {
          association: 'product',
        },
      ],
      attributes: ['id', 'created_at', 'updated_at'],
    });
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const bookmark = await Bookmark.findByPk(id, {
      paranoid: false,
    });

    if (!bookmark) {
      throw new NotFoundException(`Bookmark not found`);
    }

    if (toBoolean(permanent)) {
      await bookmark.destroy({ force: true });
      return {
        message: 'Bookmark is removed permanently',
      };
    } else if (toBoolean(restore)) {
      if (bookmark.deleted_at === null) {
        throw new BadRequestException(`Cart is not deleted`);
      }
      bookmark.restore();
      return {
        message: 'Bookmark is restored successfully',
      };
    }

    await bookmark.destroy();

    return {
      message: 'Bookmark deleted successfully',
    };
  }
}
