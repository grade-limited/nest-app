import { Module } from '@nestjs/common';
import { OrgOrdersService } from './org_orders.service';
import { OrgOrdersController } from './org_orders.controller';

@Module({
  controllers: [OrgOrdersController],
  providers: [OrgOrdersService],
})
export class OrgOrdersModule {}
