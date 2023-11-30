import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
