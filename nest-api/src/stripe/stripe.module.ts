import { forwardRef, Logger, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { OrderModule } from 'src/order/order.module';
import { Product } from 'src/product/data/product.interface';
import { CrudProductService } from 'src/product/product.crud.service';
import { OrderService } from 'src/order/order.service';
import { ProductsModule } from 'src/product/product.module';
import { ordreProviders } from 'src/order/order.provider';
import { productProviders } from 'src/product/product.provider';
import { DatabaseModule } from 'src/database/database.module';
import { mailingListProviders } from 'src/mailing-list/mailing-list.provider';
import { MailingListService } from 'src/mailing-list/mailing-list.service';

@Module({
  imports: [
    forwardRef(() => OrderModule),
    forwardRef(() => ProductsModule),
    forwardRef(() => OrderModule),
    DatabaseModule,
  ],
  providers: [
    StripeService,
    CrudProductService,
    MailingListService,
    OrderService,
    Logger,
    ...ordreProviders,
    ...productProviders,
    ...mailingListProviders,
  ],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
