import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class OrgOrderDto {
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
    required: false,
    default: 0,
  })
  discount: number;
}

export class CreateOrgOrderDto {
  @ApiProperty({
    required: true,
    type: 'object',
    isArray: true,
    items: {
      $ref: getSchemaPath(OrgOrderDto),
    },
  })
  product_list: OrgOrderDto[];

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
