import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(201)
  create(@Request() req, @Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(req.user, createCartDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.cartsService.findAll(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartsService.update(req.user, +id, updateCartDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
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
    @Request() req,
    @Param('id') id: string,
    @Query('permanent') permanent?: boolean,
    @Query('restore') restore?: boolean,
  ) {
    return this.cartsService.remove(req.user, +id, permanent, restore);
  }
}
