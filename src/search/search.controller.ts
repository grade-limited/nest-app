import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  IPaginationQuery,
  SearchQuery,
} from 'src/utils/Pagination/dto/query.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Get('category')
  // @ApiQuery(TrashQuery)
  // @ApiQuery(ShowParanoidQuery)
  // @ApiQuery(SortQuery)
  // @ApiQuery(PageQuery)
  // @ApiQuery(LimitQuery)
  @ApiQuery(SearchQuery)
  getCategory(@Query() query: IPaginationQuery) {
    return this.searchService.getCategory(query);
  }
}
