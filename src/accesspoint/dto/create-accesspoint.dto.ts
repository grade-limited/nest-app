import { ApiProperty } from '@nestjs/swagger';

export class CreateAccesspointDto {
  @ApiProperty()
  point_name: string;
}
