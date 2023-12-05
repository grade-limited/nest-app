import { ApiProperty } from '@nestjs/swagger';
export class CreateEmployeeshipDto {
  @ApiProperty()
  organization_id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  employee_id: string;

  @ApiProperty()
  depertment: string;

  @ApiProperty()
  designation: string;

  @ApiProperty()
  branch: string;

  @ApiProperty()
  desk_info?: string;

  @ApiProperty()
  business_unit?: string;
}
