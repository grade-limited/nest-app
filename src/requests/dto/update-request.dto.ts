import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateRequestDto } from './create-request.dto';

export class UpdateRequestDto extends PartialType(CreateRequestDto) {
  @ApiProperty()
  organization_name?: string;

  @ApiProperty({
    enum: ['Retail Shop', 'Hotel/Restaurant', 'Corporate Company'],
  })
  business_type?: string;

  @ApiProperty()
  business_subtype?: string;

  @ApiProperty()
  contact_number?: string;

  @ApiProperty()
  contact_email?: string;

  @ApiProperty()
  contact_address?: string;

  @ApiProperty()
  facebook_url?: string;

  @ApiProperty()
  website_url?: string;

  @ApiProperty()
  linkedin_url?: string;

  @ApiProperty()
  instagram_url?: string;

  @ApiProperty()
  contact_person_name?: string;

  @ApiProperty()
  contact_person_phone?: string;

  @ApiProperty()
  contact_person_address?: string;

  @ApiProperty()
  contact_person_employee_id?: string;

  @ApiProperty()
  contact_person_dept?: string;

  @ApiProperty()
  contact_person_designation?: string;

  @ApiProperty()
  contact_person_branch?: string;

  @ApiProperty()
  contact_person_desk_information?: string;

  @ApiProperty()
  contact_person_business_unit?: string;

  @ApiProperty({
    enum: ['pending', 'approved', 'in progress', 'declined'],
  })
  request_status?: string;
}
