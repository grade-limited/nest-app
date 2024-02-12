import { Module } from '@nestjs/common';
import { OrgCartsService } from './org_carts.service';
import { OrgCartsController } from './org_carts.controller';

@Module({
  controllers: [OrgCartsController],
  providers: [OrgCartsService],
})
export class OrgCartsModule {}
