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
import { CartQuotationService } from './cart-quotation.service';
import { CreateCartQuotationDto } from './dto/create-cart-quotation.dto';
import { UpdateCartQuotationDto } from './dto/update-cart-quotation.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('cart-quotation')
@Controller('cart-quotation')
export class CartQuotationController {
  constructor(private readonly cartQuotationService: CartQuotationService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(201)
  create(
    @Request() req,
    @Body() createCartQuotationDto: CreateCartQuotationDto,
  ) {
    return this.cartQuotationService.create(req.user, createCartQuotationDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.cartQuotationService.findAll(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCartQuotationDto: UpdateCartQuotationDto,
  ) {
    return this.cartQuotationService.update(
      req.user,
      +id,
      updateCartQuotationDto,
    );
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
    return this.cartQuotationService.remove(req.user, +id, permanent, restore);
  }
}
