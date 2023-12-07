import { Controller, Get, Param } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Shop')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}
  @Get('product/:id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(+id);
  }
}
