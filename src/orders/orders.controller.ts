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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
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

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Post()
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user, createOrderDto);
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
    return this.ordersService.findAll(query, user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
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
    return this.ordersService.remove(+id, permanent, restore);
  }
}
