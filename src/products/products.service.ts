import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import Product from './entities/product.entity';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';
import Pagination from 'src/utils/Pagination';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {
  async create(createProductDto: CreateProductDto) {
    const { name, description, brand_id, thumbnail_url } = createProductDto;

    await Product.create({
      name,
      description,
      brand_id,
      thumbnail_url,
    });
    return {
      statusCode: 201,
      message: `${name} Registered as a product successfully`,
    };
  }

  async findAll(query: IPaginationQuery, brand_id?: number) {
    const pagination = new Pagination(query);

    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops(['name']);
    const filters = pagination.format_filters({
      brand_id,
      //category_id
    });
    return pagination.arrange(
      await Product.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          ...filters,
          ...trash_query,
        },
        include: [
          {
            association: 'brand',
            //'category',
            attributes: ['id', 'name', 'description'],
          },
        ],
        //attributes:
        // {
        //   include: [
        //     [
        //       sequelize.literal(
        //         `(SELECT COUNT(*) FROM topic WHERE topic.chapter_id = Chapter.id)`,
        //       ),
        //       'total_topics',
        //     ],
        //   ],
        // },
        order,
        paranoid,
        limit,
        offset,
      }),
    );
  }

  async findOne(id: number) {
    const product = await Product.findByPk(id, {
      include: [
        {
          association: 'brand',
        },
      ],
      paranoid: false,
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }
    return {
      message: 'Product fetched successfully',
      data: product,
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { name, description, brand_id, thumbnail_url } = updateProductDto;

    const product = await Product.findByPk(id);
    if (!product) {
      throw new NotFoundException(`Product not found`);
    }
    await product.update({
      name,
      description,
      brand_id,
      thumbnail_url,
    });
    return {
      message: 'Product updated successfully',
    };
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const product = await Product.findByPk(id, {
      paranoid: false,
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    if (permanent) {
      await product.destroy({ force: true });
      return {
        message: 'Product deleted permanently',
      };
    } else if (restore) {
      if (product.deleted_at === null) {
        throw new BadRequestException(`Product not deleted`);
      }
      product.restore();
      return {
        message: 'Product restored successfully',
      };
    }

    await product.destroy();

    return {
      message: 'Product deleted successfully',
    };
  }
}
