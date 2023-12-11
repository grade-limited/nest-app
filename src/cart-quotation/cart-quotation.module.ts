import { Module } from '@nestjs/common';
import { CartQuotationService } from './cart-quotation.service';
import { CartQuotationController } from './cart-quotation.controller';

@Module({
  controllers: [CartQuotationController],
  providers: [CartQuotationService],
})
export class CartQuotationModule {}
