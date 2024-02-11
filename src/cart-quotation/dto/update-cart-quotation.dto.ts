import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCartQuotationDto } from './create-cart-quotation.dto';

export class UpdateCartQuotationDto extends PartialType(
  CreateCartQuotationDto,
) {
  @ApiProperty()
  quantity?: number;

  @ApiProperty()
  custom_attributes: {
    description: string;
    attachments: string[];
  };
}
