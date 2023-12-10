import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Query,
  Request,
} from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  IPaginationQuery,
  LimitQuery,
  PageQuery,
  SearchQuery,
  ShowParanoidQuery,
  SortQuery,
  TrashQuery,
} from 'src/utils/Pagination/dto/query.dto';

@ApiTags('quotations')
@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Post()
  create(@Request() req, @Body() createQuotationDto: CreateQuotationDto) {
    return this.quotationsService.create(req.user, createQuotationDto);
  }

  @Get()
  @ApiQuery({
    name: 'user_id',
    type: 'number',
    required: false,
  })
  @ApiQuery(TrashQuery)
  @ApiQuery(ShowParanoidQuery)
  @ApiQuery(SortQuery)
  @ApiQuery(PageQuery)
  @ApiQuery(LimitQuery)
  @ApiQuery(SearchQuery)
  findAll(
    @Query() query: IPaginationQuery,
    @Query('user_id') user_id?: number,
  ) {
    return this.quotationsService.findAll(query, user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuotationDto: UpdateQuotationDto,
  ) {
    return this.quotationsService.update(+id, updateQuotationDto);
  }

  @Delete(':id')
  @ApiQuery({
    name: 'permanent',
    type: 'boolean',
    required: false,
  })
  @ApiQuery({
    name: 'restore',
    type: 'boolean',
    required: false,
  })
  remove(
    @Param('id') id: string,
    @Query('permanent') permanent?: boolean,
    @Query('restore') restore?: boolean,
  ) {
    return this.quotationsService.remove(+id, permanent, restore);
  }
}
