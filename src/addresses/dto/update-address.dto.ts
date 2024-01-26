import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @ApiProperty()
  description: string;

  @ApiProperty()
  label: string;
}
