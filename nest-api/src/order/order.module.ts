import { Logger, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ordreProviders } from './order.provider';
import { CrudProductService } from 'src/product/product.crud.service';
import { DatabaseModule } from 'src/database/database.module';
import { productProviders } from 'src/product/product.provider';
import { StripeService } from 'src/stripe/stripe.service';
import { MailingListService } from 'src/mailing-list/mailing-list.service';
import { mailingListProviders } from 'src/mailing-list/mailing-list.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    CrudProductService,
    MailingListService,
    StripeService,
    Logger,
    ...ordreProviders,
    ...mailingListProviders,
    ...productProviders,
  ],
})
export class OrderModule {}
