import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty()
  'name': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'thumbnail_url': string;

  @ApiProperty({
    required: false,
  })
  'sku': string;

  @ApiProperty({
    required: false,
  })
  'unit_of_measure': string;

  @ApiProperty({
    required: false,
  })
  'minimum_order_quantity': {
    account_type: string;
    quantity: number;
  }[];

  @ApiProperty({
    required: false,
  })
  'price': {
    account_type: string;
    min_quantity: number;
    per_unit: number;
  }[];

  @ApiProperty({
    required: false,
  })
  'market_price': number;

  @ApiProperty()
  'category_id': number;

  @ApiProperty()
  'brand_id': number;

  @ApiProperty()
  'is_published': boolean;

  @ApiProperty()
  'emi_available': boolean;

  @ApiProperty()
  'attachments': string[];
}
