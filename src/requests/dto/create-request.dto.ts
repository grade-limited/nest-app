import { ApiProperty } from '@nestjs/swagger';
export class CreateRequestDto {
  @ApiProperty({
    required: true,
  })
  organization_name: string;

  @ApiProperty({
    enum: ['Retail Shop', 'Hotel/Restaurant', 'Corporate Company'],
  })
  business_type: string;

  @ApiProperty({
    required: true,
  })
  business_subtype: string;

  @ApiProperty({
    required: true,
  })
  contact_number: string;

  @ApiProperty()
  contact_email?: string;

  @ApiProperty({
    required: true,
  })
  contact_address: string;

  @ApiProperty()
  facebook_url?: string;

  @ApiProperty()
  website_url?: string;

  @ApiProperty()
  linkedin_url?: string;

  @ApiProperty()
  instagram_url?: string;

  @ApiProperty({
    required: true,
  })
  contact_person_name: string;

  @ApiProperty({
    required: true,
  })
  contact_person_phone: string;

  @ApiProperty()
  contact_person_address?: string;

  @ApiProperty()
  contact_person_employee_id?: string;

  @ApiProperty({
    required: true,
  })
  contact_person_dept: string;

  @ApiProperty({
    required: true,
  })
  contact_person_designation: string;

  @ApiProperty({
    required: true,
  })
  contact_person_branch: string;

  @ApiProperty()
  contact_person_desk_information?: string;

  @ApiProperty()
  contact_person_business_unit?: string;

  @ApiProperty({
    enum: ['pending', 'approved', 'in progress', 'declined'],
  })
  request_status?: string;
}
