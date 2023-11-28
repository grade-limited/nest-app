import { ApiProperty } from '@nestjs/swagger';

export class UploadSingleFileDto {
  // @ApiProperty({ type: 'string', format: 'binary', isArray: true })
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
