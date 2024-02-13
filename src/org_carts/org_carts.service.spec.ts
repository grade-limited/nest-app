import { Test, TestingModule } from '@nestjs/testing';
import { OrgCartsService } from './org_carts.service';

describe('OrgCartsService', () => {
  let service: OrgCartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrgCartsService],
    }).compile();

    service = module.get<OrgCartsService>(OrgCartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
