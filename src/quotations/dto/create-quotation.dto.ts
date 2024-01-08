import { ApiProperty } from '@nestjs/swagger';

export class CreateQuotationDto {
  @ApiProperty({
    required: true,
    type: 'object',
    isArray: true,
  })
  product_list: {
    product_id: number;
    cart_id: number;
    quantity: number;
    is_customized: boolean;
    requirments: string;
    attachments: string[];
  }[];

  @ApiProperty({
    required: true,
  })
  contact_name: string;

  @ApiProperty({
    required: true,
  })
  contact_number: string;

  @ApiProperty({
    required: false,
  })
  contact_email?: string;

  @ApiProperty({
    required: true,
  })
  contact_designation: string;
}
