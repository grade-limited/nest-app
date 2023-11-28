import { ApiProperty } from '@nestjs/swagger';

export class ResetPassDto {
  @ApiProperty()
  current_password: string;

  @ApiProperty()
  new_password: string;
}
