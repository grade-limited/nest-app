import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCartQuotationDto } from './create-cart-quotation.dto';

export class UpdateCartQuotationDto extends PartialType(
  CreateCartQuotationDto,
) {
  @ApiProperty()
  quantity?: number;
}
