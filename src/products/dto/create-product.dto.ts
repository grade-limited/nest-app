import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
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
  'thumbnail_url': string;

  @ApiProperty({
    required: false,
  })
  'category_id': number;

  @ApiProperty({
    required: false,
  })
  'brand_id': number;

  @ApiProperty()
  'attachments'?: string[];
}
