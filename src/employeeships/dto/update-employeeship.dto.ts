import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateEmployeeshipDto } from './create-employeeship.dto';

export class UpdateEmployeeshipDto extends PartialType(CreateEmployeeshipDto) {
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
}
