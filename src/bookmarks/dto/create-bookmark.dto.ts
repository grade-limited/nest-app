import { ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkDto {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  user_id: number;
}
