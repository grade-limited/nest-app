import { Controller, Get, Param, Query } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  IPaginationQuery,
  LimitQuery,
  PageQuery,
  SearchQuery,
  ShowParanoidQuery,
  SortQuery,
  TrashQuery,
} from 'src/utils/Pagination/dto/query.dto';

@ApiTags('Shop')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}
  @Get('product/:id')
  findOne(@Param('id') id: string) {
    return this.shopService.findOne(+id);
  }

  @Get('product-search')
  @ApiQuery({
    name: 'brand_id',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'category_id',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'campaign_id',
    type: 'number',
    required: false,
  })
  @ApiQuery(TrashQuery)
  @ApiQuery(ShowParanoidQuery)
  @ApiQuery(SortQuery)
  @ApiQuery(PageQuery)
  @ApiQuery(LimitQuery)
  @ApiQuery(SearchQuery)
  ProductSearch(
    @Query() query: IPaginationQuery,
    @Query('brand_id') brand_id?: number,
    @Query('category_id') category_id?: number,
    @Query('campaign_id') campaign_id?: number,
  ) {
    return this.shopService.ProductSearch(
      query,
      brand_id,
      category_id,
      campaign_id,
    );
  }

  @Get('landing/cat-prod')
  LandingPage() {
    return this.shopService.LandingPage();
  }

  @Get('brand-by-category/:id')
  BrandByCategory(@Param('id') id: string) {
    return this.shopService.BrandByCategory(+id);
  }
}
