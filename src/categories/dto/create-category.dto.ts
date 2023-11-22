import { ApiProperty } from '@nestjs/swagger';
export class CreateCategoryDto {
  @ApiProperty({
    required: true,
  })
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
}
