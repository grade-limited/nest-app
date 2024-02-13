import { ApiProperty } from '@nestjs/swagger';

export class CreateOrgCartDto {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  quantity: number;
}
