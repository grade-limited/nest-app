import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiProperty()
  first_name?: string;

  @ApiProperty()
  last_name?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  display_picture?: string;

  @ApiProperty()
  gender?: string;

  @ApiProperty()
  dob?: Date;

  @ApiProperty()
  address?: string;
}
