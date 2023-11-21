import { Test, TestingModule } from '@nestjs/testing';
import { AccesspointService } from './accesspoint.service';

describe('AccesspointService', () => {
  let service: AccesspointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccesspointService],
    }).compile();

    service = module.get<AccesspointService>(AccesspointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
