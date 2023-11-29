import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  first_name?: string;

  @ApiProperty()
  last_name?: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  max_session?: number;

  @ApiProperty()
  gender?: string;

  @ApiProperty()
  display_picture?: string;

  @ApiProperty()
  dob?: Date;

  @ApiProperty()
  address?: string;
}
