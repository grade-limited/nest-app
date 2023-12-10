import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsletterDto {
  @ApiProperty()
  email: string;
}
