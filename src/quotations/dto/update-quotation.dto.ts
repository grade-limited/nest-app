import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateQuotationDto } from './create-quotation.dto';

export class UpdateQuotationDto extends PartialType(CreateQuotationDto) {
  @ApiProperty({
    enum: ['Pending', 'Accepted', 'Processing', 'Completed', 'Declined'],
  })
  status?: string;
}
