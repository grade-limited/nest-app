import { ApiProperty } from '@nestjs/swagger';

export class CreateCartQuotationDto {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  quantity: number;
}
