import { Module } from '@nestjs/common';
import { EmployeeshipsService } from './employeeships.service';
import { EmployeeshipsController } from './employeeships.controller';

@Module({
  controllers: [EmployeeshipsController],
  providers: [EmployeeshipsService],
})
export class EmployeeshipsModule {}
