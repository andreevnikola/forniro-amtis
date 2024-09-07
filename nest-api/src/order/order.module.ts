import { Logger, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ordreProviders } from './order.provider';
import { CrudProductService } from 'src/product/product.crud.service';
import { DatabaseModule } from 'src/database/database.module';
import { productProviders } from 'src/product/product.provider';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    CrudProductService,
    StripeService,
    Logger,
    ...ordreProviders,
    ...productProviders,
  ],
})
export class OrderModule {}
