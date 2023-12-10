import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    required: true,
  })
  recipient_name?: string;

  @ApiProperty({
    required: true,
  })
  recipient_number?: string;

  @ApiProperty({
    required: false,
  })
  recipient_email?: string;

  @ApiProperty({
    required: true,
  })
  recipient_address?: string;

  @ApiProperty({
    enum: ['Pending', 'Accepted', 'Processing', 'delivered', 'Declined'],
  })
  status?: string;

  @ApiProperty({
    required: true,
  })
  expected_delivery_date?: Date;

  @ApiProperty({
    required: true,
  })
  delivery_fee?: number;

  @ApiProperty({
    required: true,
  })
  discount?: number;
}
