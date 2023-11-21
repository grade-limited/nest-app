import { Test, TestingModule } from '@nestjs/testing';
import { AccesspointController } from './accesspoint.controller';
import { AccesspointService } from './accesspoint.service';

describe('AccesspointController', () => {
  let controller: AccesspointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccesspointController],
      providers: [AccesspointService],
    }).compile();

    controller = module.get<AccesspointController>(AccesspointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
