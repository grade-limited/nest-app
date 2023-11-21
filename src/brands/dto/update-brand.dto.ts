import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @ApiProperty()
  'name': string;
  @ApiProperty()
  'description': string;

  @ApiProperty()
  'thumbnail_url': string;

  @ApiProperty()
  'cover_url': string;
}
