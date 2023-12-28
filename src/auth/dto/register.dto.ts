import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  gender?: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  dob?: Date;

  @ApiProperty()
  address?: string;

  @ApiProperty({
    enum: ['phone', 'email'],
  })
  primary_contact: string;

  @ApiProperty({
    enum: ['API', 'Website', 'Android', 'iOS', 'Admin'],
  })
  registered_from: string;

  @ApiProperty()
  referral_code?: string;
}
