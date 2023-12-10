import { ApiProperty } from '@nestjs/swagger';

export class UpdateQuotationDto {
  @ApiProperty({
    enum: ['Pending', 'Accepted', 'Processing', 'Completed', 'Declined'],
  })
  status?: string;
}
