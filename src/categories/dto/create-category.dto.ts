import { ApiProperty } from '@nestjs/swagger';
export class CreateCategoryDto {
  @ApiProperty({
    required: true,
  })
  'name': string;

  @ApiProperty({
    required: false,
  })
  'description': string;

  @ApiProperty({
    required: false,
  })
  'parent_id': number;

  @ApiProperty({
    required: false,
  })
  'thumbnail_url': string;

  @ApiProperty({
    required: false,
  })
  'cover_url': string;

  @ApiProperty({
    required: false,
  })
  'icon_url': string;
}
