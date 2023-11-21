import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Put,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './admin.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { ResetPassDto } from './dto/reset-pass.dto';
import { RealIP } from 'nestjs-real-ip';
import { AdminGuard } from './admin.guard';

@ApiTags('Admin')
@Controller('admin')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(200)
  login(@Body() loginDto: LoginDto, @RealIP() ip: string) {
    return this.authService.login(loginDto, ip);
  }

  @Put('verify')
  verify(@Body() verifyDto: VerifyDto) {
    return this.authService.verify(verifyDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('validate')
  validate(@Request() req) {
    return this.authService.validate(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch('reset-password')
  resetpass(@Request() req, @Body() resetPassDto: ResetPassDto) {
    return this.authService.resetpass(req.user, resetPassDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch('update')
  @HttpCode(201)
  update(@Request() req, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(req.user, updateAuthDto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete('signout')
  signout(@Request() req) {
    return this.authService.signout(req.jwt_token);
  }
}
