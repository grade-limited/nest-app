import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  // @ApiProperty()
  // username: string;

  @ApiProperty({
    enum: ['Male', 'Female', 'Non Binary'],
  })
  gender?: string;

  @ApiProperty()
  password: string;

  @ApiProperty({
    required: false,
  })
  display_picture?: string;

  @ApiProperty({
    required: false,
  })
  email?: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({
    format: 'date',
    required: false,
  })
  dob?: Date;

  @ApiProperty({
    default: 4,
    required: false,
  })
  max_session?: number;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  role_id?: number;
}
