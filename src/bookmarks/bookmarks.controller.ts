import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('bookmarks')
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Post()
  create(@Request() req, @Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarksService.create(req.user, createBookmarkDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.bookmarksService.findAll(req.user);
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
    return this.bookmarksService.remove(req.user, +id, permanent, restore);
  }
}
