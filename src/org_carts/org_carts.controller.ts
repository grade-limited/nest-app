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
import { OrgCartsService } from './org_carts.service';
import { CreateOrgCartDto } from './dto/create-org_cart.dto';
import { UpdateOrgCartDto } from './dto/update-org_cart.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('org-carts')
@Controller('org-carts')
export class OrgCartsController {
  constructor(private readonly orgCartsService: OrgCartsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(201)
  create(@Request() req, @Body() createOrgCartDto: CreateOrgCartDto) {
    return this.orgCartsService.create(req.user, createOrgCartDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.orgCartsService.findAll(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateOrgCartDto: UpdateOrgCartDto,
  ) {
    return this.orgCartsService.update(req.user, +id, updateOrgCartDto);
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
    return this.orgCartsService.remove(req.user, +id, permanent, restore);
  }
}
