import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @ApiProperty({
    required: false,
  })
  first_name: string;

  @ApiProperty({
    required: false,
  })
  last_name: string;

  @ApiProperty({
    required: false,
  })
  gender?: string;

  @ApiProperty({
    required: false,
  })
  role_id: number;

  @ApiProperty({
    required: false,
  })
  display_picture: string;

  @ApiProperty({
    required: false,
  })
  email: string;

  @ApiProperty({
    required: false,
  })
  phone: string;

  @ApiProperty({
    required: false,
  })
  dob: Date;

  @ApiProperty({
    required: false,
  })
  address: string;

  @ApiProperty({
    required: false,
  })
  max_session?: number;
}
