import { Module } from '@nestjs/common';
import { AccesspointService } from './accesspoint.service';
import { AccesspointController } from './accesspoint.controller';

@Module({
  controllers: [AccesspointController],
  providers: [AccesspointService],
})
export class AccesspointModule {}
