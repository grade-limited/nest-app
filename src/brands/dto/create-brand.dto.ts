import { ApiProperty } from '@nestjs/swagger';
export class CreateBrandDto {
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
  'cover_url': string;
}
