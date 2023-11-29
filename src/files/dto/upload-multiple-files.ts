import { ApiProperty } from '@nestjs/swagger';

export class UploadMultipleFilesDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    maxItems: 10,
  })
  files: any;
}
