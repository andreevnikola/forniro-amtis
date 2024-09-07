import { Logger, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ordreProviders } from './order.provider';
import { CrudProductService } from 'src/product/product.crud.service';
import { DatabaseModule } from 'src/database/database.module';
import { productProviders } from 'src/product/product.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    CrudProductService,
    Logger,
    ...ordreProviders,
    ...productProviders,
  ],
})
export class OrderModule {}
