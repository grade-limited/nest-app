import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateOrganizationDto } from './create-organization.dto';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  contact_number?: string;

  @ApiProperty()
  contact_email?: string;

  @ApiProperty({
    enum: ['Retail Shop', 'Hotel/Restaurant', 'Corporate Company'],
  })
  business_type?: string;

  @ApiProperty()
  business_subtype?: string;

  @ApiProperty()
  website_url?: string;

  @ApiProperty()
  linkedin_url?: string;

  @ApiProperty()
  facebook_url?: string;

  @ApiProperty()
  instagram_url?: string;
}
