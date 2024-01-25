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
import toBoolean from 'src/utils/conversion/toBoolean';

@Injectable()
export class ProductsService {
  async create(createProductDto: CreateProductDto) {
    try {
      const {
        name,
        description,
        category_id,
        brand_id,
        thumbnail_url,
        attachments,
        price,
        minimum_order_quantity,
        sku,
        unit_of_measure,
        market_price,
        emi_available,
      } = createProductDto;

      await Product.create({
        name,
        description,
        brand_id,
        category_id,
        thumbnail_url,
        sku,
        unit_of_measure,
        market_price,
        emi_available,
        price: JSON.stringify(price || []),
        attachments: JSON.stringify(attachments || []),
        minimum_order_quantity: JSON.stringify(minimum_order_quantity || []),
      });
      return {
        statusCode: 201,
        message: `${name} Registered as a product successfully`,
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async findAll(
    query: IPaginationQuery,
    brand_id?: number,
    category_id?: number,
    campaign_id?: number,
    is_published?: boolean,
    emi_available?: boolean,
  ) {
    const pagination = new Pagination(query);

    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops(['name']);
    const filters = pagination.format_filters({
      brand_id,
      category_id,
      is_published,
      emi_available,
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
            //attributes: ['id', 'name', 'description'],
          },
          {
            association: 'category',
            //attributes: ['id', 'name', 'description'],
          },
          {
            association: 'campaigns',
            ...(!!campaign_id && {
              where: {
                id: campaign_id,
              },
            }),
          },
        ],
        order,
        paranoid,
        limit,
        offset,
      }),
    );
  }

  async findOne(id: number) {
    try {
      const product = await Product.findByPk(id, {
        include: [
          {
            association: 'brand',
          },
          {
            association: 'category',
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
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const {
        name,
        description,
        brand_id,
        thumbnail_url,
        category_id,
        attachments,
        price,
        minimum_order_quantity,
        sku,
        unit_of_measure,
        market_price,
        is_published,
        emi_available,
      } = updateProductDto;

      const product = await Product.findByPk(id);
      if (!product) {
        throw new NotFoundException(`Product not found`);
      }
      await product.update({
        name,
        description,
        brand_id,
        category_id,
        thumbnail_url,
        sku,
        unit_of_measure,
        market_price,
        is_published,
        emi_available,
        ...(price !== null ? { price: JSON.stringify(price || []) } : {}),
        ...(attachments !== null
          ? { attachments: JSON.stringify(attachments || []) }
          : {}),
        ...(minimum_order_quantity !== null
          ? {
              minimum_order_quantity: JSON.stringify(
                minimum_order_quantity || [],
              ),
            }
          : {}),
      });
      return {
        message: 'Product updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        error?.errors?.[0]?.message || error?.message || error,
      );
    }
  }

  async remove(id: number, permanent?: boolean, restore?: boolean) {
    const product = await Product.findByPk(id, {
      paranoid: false,
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    if (toBoolean(permanent)) {
      await product.destroy({ force: true });
      return {
        message: 'Product deleted permanently',
      };
    } else if (toBoolean(restore)) {
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
