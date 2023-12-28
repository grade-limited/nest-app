import { ApiProperty } from '@nestjs/swagger';

export class UpdateRequestDto {
  @ApiProperty({
    enum: ['pending', 'approved', 'in progress', 'declined'],
  })
  request_status?: string;

  @ApiProperty()
  organization_id?: number;

  @ApiProperty()
  employee_id?: number;
}
