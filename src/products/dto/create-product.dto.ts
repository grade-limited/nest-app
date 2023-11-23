import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
  @ApiProperty({
    required: true,
  })
  'name': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'thumbnail_url': string;

  @ApiProperty()
  'category_id': number;

  @ApiProperty()
  'brand_id': number;
}
