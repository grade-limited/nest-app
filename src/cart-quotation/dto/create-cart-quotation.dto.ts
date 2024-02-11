import { ApiProperty } from '@nestjs/swagger';

export class CreateCartQuotationDto {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  custom_attributes: {
    description: string;
    attachments: string[];
  };
}
