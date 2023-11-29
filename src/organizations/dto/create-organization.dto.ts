import { ApiProperty } from '@nestjs/swagger';
export class CreateOrganizationDto {
  @ApiProperty({
    required: true,
  })
  name: string;

  @ApiProperty({
    required: true,
  })
  contact_number: string;

  @ApiProperty({
    required: true,
  })
  contact_email: string;

  @ApiProperty({
    enum: ['Retail Shop', 'Hotel/Restaurant', 'Corporate Company'],
  })
  business_type: string;

  @ApiProperty()
  business_subtype: string;

  @ApiProperty()
  website_url?: string;

  @ApiProperty()
  linkedin_url?: string;

  @ApiProperty()
  facebook_url?: string;

  @ApiProperty()
  instagram_url?: string;
}
