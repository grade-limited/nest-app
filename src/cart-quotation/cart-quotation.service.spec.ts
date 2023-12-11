import { Test, TestingModule } from '@nestjs/testing';
import { CartQuotationService } from './cart-quotation.service';

describe('CartQuotationService', () => {
  let service: CartQuotationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartQuotationService],
    }).compile();

    service = module.get<CartQuotationService>(CartQuotationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
