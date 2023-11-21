import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    required: true,
  })
  'name': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'thumbnail_url': string;

  //   @ApiProperty()
  //   'category_id': number;

  @ApiProperty()
  'brand_id': number;
}
