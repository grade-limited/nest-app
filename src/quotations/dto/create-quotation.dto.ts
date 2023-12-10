import { ApiProperty } from '@nestjs/swagger';

export class CreateQuotationDto {
  @ApiProperty({
    required: true,
  })
  contact_name: string;

  @ApiProperty({
    required: true,
  })
  contact_number: string;

  @ApiProperty({
    required: true,
  })
  contact_email?: string;

  @ApiProperty({
    required: true,
  })
  contact_designation?: string;

  @ApiProperty({
    enum: ['Pending', 'Accepted', 'Processing', 'Completed', 'Declined'],
  })
  status: string;
}
