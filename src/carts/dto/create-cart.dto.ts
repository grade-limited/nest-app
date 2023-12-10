import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  quantity: number;
}
