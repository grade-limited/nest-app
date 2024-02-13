import { Test, TestingModule } from '@nestjs/testing';
import { OrgOrdersController } from './org_orders.controller';
import { OrgOrdersService } from './org_orders.service';

describe('OrgOrdersController', () => {
  let controller: OrgOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgOrdersController],
      providers: [OrgOrdersService],
    }).compile();

    controller = module.get<OrgOrdersController>(OrgOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
