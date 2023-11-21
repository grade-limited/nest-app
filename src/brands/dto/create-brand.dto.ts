import { ApiProperty } from '@nestjs/swagger';
export class CreateBrandDto {
  @ApiProperty({
    required: true,
  })
  'name': string;

  @ApiProperty()
  'description': string;

  @ApiProperty()
  'thumbnail_url': string;

  @ApiProperty()
  'cover_url': string;
}
