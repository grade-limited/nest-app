import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmployeeshipDto {
  @ApiProperty()
  employee_id?: string;

  @ApiProperty()
  depertment?: string;

  @ApiProperty()
  designation?: string;

  @ApiProperty()
  branch?: string;

  @ApiProperty()
  desk_info?: string;

  @ApiProperty()
  business_unit?: string;

  @ApiProperty()
  employeeship_status?: string;
}
