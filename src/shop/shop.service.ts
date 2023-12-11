import { Injectable, NotFoundException } from '@nestjs/common';
import Category from 'src/categories/entities/category.entity';
import Product from 'src/products/entities/product.entity';

@Injectable()
export class ShopService {
  async findOne(id: number) {
    const product = await Product.findByPk(id, {
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
}
