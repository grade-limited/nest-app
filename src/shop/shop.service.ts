import { Injectable, NotFoundException } from '@nestjs/common';
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
}
