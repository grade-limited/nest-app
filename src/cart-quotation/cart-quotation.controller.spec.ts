import { Test, TestingModule } from '@nestjs/testing';
import { CartQuotationController } from './cart-quotation.controller';
import { CartQuotationService } from './cart-quotation.service';

describe('CartQuotationController', () => {
  let controller: CartQuotationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartQuotationController],
      providers: [CartQuotationService],
    }).compile();

    controller = module.get<CartQuotationController>(CartQuotationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
