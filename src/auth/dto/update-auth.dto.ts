import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthDto {
  @ApiProperty()
  first_name?: string;

  @ApiProperty()
  last_name?: string;

  @ApiProperty()
  display_picture?: string;

  @ApiProperty()
  gender?: string;

  @ApiProperty()
  dob?: Date;

  @ApiProperty()
  address?: string;
}
