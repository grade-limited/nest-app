import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty()
  'name': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'parent_id': number;

  @ApiProperty()
  'thumbnail_url': string;

  @ApiProperty()
  'cover_url': string;

  @ApiProperty()
  'icon_url': string;

  @ApiProperty()
  'color_code': string;
}
