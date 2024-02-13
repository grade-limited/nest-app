import { Test, TestingModule } from '@nestjs/testing';
import { OrgCartsController } from './org_carts.controller';
import { OrgCartsService } from './org_carts.service';

describe('OrgCartsController', () => {
  let controller: OrgCartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgCartsController],
      providers: [OrgCartsService],
    }).compile();

    controller = module.get<OrgCartsController>(OrgCartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
