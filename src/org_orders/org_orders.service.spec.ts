import { Test, TestingModule } from '@nestjs/testing';
import { OrgOrdersService } from './org_orders.service';

describe('OrgOrdersService', () => {
  let service: OrgOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrgOrdersService],
    }).compile();

    service = module.get<OrgOrdersService>(OrgOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
