import { Module } from '@nestjs/common';
import { AuthService } from './admin.service';
import { AuthController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRE,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AdminModule {}
