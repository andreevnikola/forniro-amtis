import { Module } from '@nestjs/common';
import { ProductsController } from './product.controller';
import { CrudProductService } from './crud.product.service';
import { productProviders } from './product.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [CrudProductService, ...productProviders],
})
export class ProductsModule {}
