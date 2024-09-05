import { Logger, Module } from '@nestjs/common';
import { ProductsController } from './product.controller';
import { CrudProductService } from './product.crud.service';
import { productProviders } from './product.provider';
import { DatabaseModule } from 'src/database/database.module';
import { S3Service } from 'src/s3.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [CrudProductService, S3Service, Logger, ...productProviders],
})
export class ProductsModule {}
