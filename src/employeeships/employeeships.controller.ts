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
} from '@nestjs/common';
import { EmployeeshipsService } from './employeeships.service';
import { CreateEmployeeshipDto } from './dto/create-employeeship.dto';
import { UpdateEmployeeshipDto } from './dto/update-employeeship.dto';
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

@ApiTags('employeeships')
@Controller('employeeships')
export class EmployeeshipsController {
  constructor(private readonly employeeshipsService: EmployeeshipsService) {}

  @HttpCode(201)
  @Post()
  create(@Body() createEmployeeshipDto: CreateEmployeeshipDto) {
    return this.employeeshipsService.create(createEmployeeshipDto);
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
  @ApiQuery({
    name: 'employeeship_status',
    type: 'string',
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
    @Query('employeeship_status') employeeship_status?: number,
  ) {
    return this.employeeshipsService.findAll(
      query,
      user_id,
      organization_id,
      employeeship_status,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeshipsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeshipDto: UpdateEmployeeshipDto,
  ) {
    return this.employeeshipsService.update(+id, updateEmployeeshipDto);
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
    return this.employeeshipsService.remove(+id, permanent, restore);
  }
}
