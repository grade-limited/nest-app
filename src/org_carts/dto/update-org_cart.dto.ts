import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrgCartDto } from './create-org_cart.dto';

export class UpdateOrgCartDto extends PartialType(CreateOrgCartDto) {
  @ApiProperty()
  quantity?: number;
}
