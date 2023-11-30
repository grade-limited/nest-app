import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateCampaignDto } from './create-campaign.dto';

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  cover_url?: string;

  @ApiProperty()
  thumbnail_url?: string;

  @ApiProperty()
  website_url?: string;

  @ApiProperty()
  is_active?: boolean;

  @ApiProperty()
  publish_date?: Date;

  @ApiProperty()
  start_date?: Date;

  @ApiProperty()
  end_date?: Date;

  @ApiProperty()
  amount?: number;

  @ApiProperty({
    enum: ['amount', 'percentage'],
  })
  amount_type?: string;

  @ApiProperty()
  campaign_type?: string;
}
