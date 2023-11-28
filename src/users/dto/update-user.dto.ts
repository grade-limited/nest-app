import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  first_name?: string;

  @ApiProperty()
  last_name?: string;

  @ApiProperty()
  gender?: string;

  @ApiProperty()
  display_picture?: string;

  @ApiProperty()
  dob?: Date;

  @ApiProperty()
  address?: string;
}
