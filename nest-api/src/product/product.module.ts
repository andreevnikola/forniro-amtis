import { Logger, Module } from '@nestjs/common';
import { ProductsController } from './product.controller';
import { CrudProductService } from './product.crud.service';
import { productProviders } from './product.provider';
import { DatabaseModule } from 'src/database/database.module';
import { S3Service } from 'src/s3.service';
import { CategoryService } from 'src/category/category.service';
import { CategoryModule } from 'src/category/category.module';
import { categoryProviders } from 'src/category/category.provider';
import { ProductReviewsService } from './product-reviews.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [
    CrudProductService,
    S3Service,
    ProductReviewsService,
    CategoryService,
    Logger,
    ...productProviders,
    ...categoryProviders,
  ],
})
export class ProductsModule {}
