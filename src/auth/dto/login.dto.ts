import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  phone?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  password: string;
}
