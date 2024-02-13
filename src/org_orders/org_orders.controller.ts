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
  Request,
  Query,
} from '@nestjs/common';
import { OrgOrdersService } from './org_orders.service';
import { CreateOrgOrderDto } from './dto/create-org_order.dto';
import { UpdateOrgOrderDto } from './dto/update-org_order.dto';
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

@ApiTags('org-orders')
@Controller('org-orders')
export class OrgOrdersController {
  constructor(private readonly orgOrdersService: OrgOrdersService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Post()
  create(@Request() req, @Body() createOrgOrderDto: CreateOrgOrderDto) {
    return this.orgOrdersService.create(req.user, createOrgOrderDto);
  }

  @Get()
  @ApiQuery({
    name: 'user_id',
    type: 'number',
    required: false,
  })
  @ApiQuery({
    name: 'organization_id',
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
    @Query('organization_id') organization_id?: number,
  ) {
    return this.orgOrdersService.findAll(query, user_id, organization_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orgOrdersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrgOrderDto: UpdateOrgOrderDto,
  ) {
    return this.orgOrdersService.update(+id, updateOrgOrderDto);
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
    return this.orgOrdersService.remove(+id, permanent, restore);
  }
}
