import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
  @ApiProperty({
    required: true,
  })
  'name': string;

  @ApiProperty({
    required: false,
  })
  'description': string;

  @ApiProperty({
    required: false,
  })
  'thumbnail_url': string;

  @ApiProperty({
    required: false,
  })
  'minimum_order_quantity': {
    account_type: string;
    quantity: number;
  }[];

  @ApiProperty({
    required: true,
  })
  'price': {
    account_type: string;
    min_quantity: number;
    per_unit: number;
  }[];

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
  'market_price': number;

  @ApiProperty({
    required: false,
  })
  'category_id': number;

  @ApiProperty({
    required: false,
  })
  'brand_id': number;

  @ApiProperty()
  'attachments'?: string[];
}
