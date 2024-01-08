import { ApiProperty } from '@nestjs/swagger';

export class OrderProductDto {
  @ApiProperty({
    required: true,
  })
  product_id: number;

  @ApiProperty({
    required: true,
  })
  cart_id: number;

  @ApiProperty({
    required: true,
  })
  quantity: number;

  @ApiProperty({
    required: true,
  })
  unit_price: number;

  @ApiProperty({
    required: true,
  })
  total_price: number;
}

export class CreateOrderDto {
  @ApiProperty({
    required: true,
    type: 'object',
    isArray: true,
  })
  product_list: {
    product_id: number;
    cart_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];

  @ApiProperty({
    enum: ['API', 'Website', 'Android', 'iOS', 'Admin'],
  })
  registered_from: string;

  @ApiProperty({
    required: true,
  })
  recipient_name: string;

  @ApiProperty({
    required: true,
  })
  recipient_number: string;

  @ApiProperty({
    required: false,
  })
  recipient_email?: string;

  @ApiProperty({
    required: true,
  })
  recipient_address: string;

  @ApiProperty({
    required: true,
  })
  delivery_fee: number;

  @ApiProperty({
    required: true,
  })
  discount: number;
}
