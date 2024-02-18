import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SmsService } from './sms.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/admin/admin.guard';

@ApiTags('SMS')
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('balance')
  checkBalance() {
    return this.smsService.checkBalance();
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiQuery({
    name: 'mobile',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'message',
    type: 'string',
    required: true,
  })
  @Get('send')
  sendSms(@Query('mobile') mobile: string, @Query('message') message: string) {
    return this.smsService.sendSms(mobile, message);
  }
}
