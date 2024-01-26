import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty()
  description?: string;

  @ApiProperty()
  label: string;
}
