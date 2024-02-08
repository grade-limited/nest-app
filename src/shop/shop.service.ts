import { Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import Brand from 'src/brands/entities/brand.entity';
import Category from 'src/categories/entities/category.entity';
import Product from 'src/products/entities/product.entity';
import Pagination from 'src/utils/Pagination';
import { IPaginationQuery } from 'src/utils/Pagination/dto/query.dto';

@Injectable()
export class ShopService {
  async findOne(id: number) {
    const product = await Product.findOne({
      where: { id, is_published: true },
      include: [
        {
          association: 'brand',
        },
        {
          association: 'category',
          include: [
            {
              association: 'parent',
            },
          ],
        },
      ],
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }
    return {
      message: 'Product fetched successfully',
      data: product,
    };
  }

  async ProductSearch(
    query: IPaginationQuery,
    brand_id?: number,
    category_id?: number,
    campaign_id?: number,
  ) {
    const pagination = new Pagination(query);

    const { limit, offset, paranoid, trash_query, order } =
      pagination.get_attributes();

    const search_ops = pagination.get_search_ops(['name']);
    const filters = pagination.format_filters({
      brand_id,
      category_id,
    });
    return pagination.arrange(
      await Product.findAndCountAll({
        where: {
          [Op.or]: search_ops,
          is_published: true,
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

  private async getNestedCategoriesWithTopProducts(
    categoryId: number,
  ): Promise<any> {
    const category = await Category.findByPk(categoryId, {
      include: [
        {
          model: Category,
          as: 'children',
          include: [
            {
              model: Product,
              include: [
                {
                  association: 'brand',
                },
                {
                  association: 'category',
                },
              ],
              limit: 10, // Limit to top 10 products
              order: [['created_at', 'DESC']], // Order by created_at, adjust as needed
            },
          ],
        },
        {
          model: Product,
          where: { is_published: true },
          include: [
            {
              association: 'brand',
            },
            {
              association: 'category',
            },
          ],
          limit: 10, // Limit to top 10 products
          order: [['created_at', 'DESC']], // Order by created_at, adjust as needed
        },
      ],
    });

    // Recursively get nested categories and their top 10 products
    const nestedCategories = await Promise.all(
      category?.children.map((child: any) =>
        this.getNestedCategoriesWithTopProducts(child.id),
      ) || [],
    );

    return {
      id: category?.id,
      name: category?.name,
      description: category?.description,
      thumbnail_url: category?.thumbnail_url,
      cover_url: category?.cover_url,
      icon_url: category?.icon_url,
      color_code: category?.color_code,
      products: category?.products,
      children: nestedCategories,
    };
  }

  private async getParentCategoriesWithChildrenProducts(): Promise<any> {
    const topLevelCategories = await Category.findAll({
      where: { parent_id: null }, // Fetch only top-level categories
    });

    const result = await Promise.all(
      topLevelCategories.map((category: any) =>
        this.getNestedCategoriesWithTopProducts(category.id),
      ),
    );

    // Flatten the nested structure
    const flattenedResult = result.map((parentCategory: any) => ({
      id: parentCategory.id,
      name: parentCategory.name,
      description: parentCategory.description,
      thumbnail_url: parentCategory.thumbnail_url,
      cover_url: parentCategory.cover_url,
      icon_url: parentCategory.icon_url,
      color_code: parentCategory.color_code,
      products: [
        ...parentCategory.products,
        ...this.getChildrenProducts(parentCategory.children),
      ],
    }));

    return flattenedResult;
  }

  private getChildrenProducts(childrenCategories: any[]): any[] {
    const result: any[] = [];
    for (const category of childrenCategories) {
      result.push(...category.products);
      result.push(...this.getChildrenProducts(category.children));
    }
    return result;
  }

  async LandingPage() {
    return await this.getParentCategoriesWithChildrenProducts();
  }

  private removeDuplicates(brands: Brand[]): Brand[] {
    const uniquebrandsMap: Map<number, Brand> = new Map();

    brands.forEach((brand) => {
      uniquebrandsMap.set(brand.id, brand);
    });

    return Array.from(uniquebrandsMap.values());
  }

  async BrandByCategory(categoryId: number) {
    const category = await Category.findByPk(categoryId, {
      include: [
        {
          model: Product,
          where: { is_published: true },
          include: [
            {
              association: 'brand',
            },
          ],
        },
      ],
    });

    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    const brands = category.products?.map?.((product) => product.brand) || [];

    return {
      success: true,
      message: 'Brands fetched successfully',
      data: this.removeDuplicates(brands),
    };
  }
}
