import { Logger, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { categoryProviders } from './category.provider';
import { S3Service } from 'src/s3.service';
import { DatabaseModule } from 'src/database/database.module';
import { CrudProductService } from 'src/product/product.crud.service';
import { productProviders } from 'src/product/product.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    S3Service,
    CrudProductService,
    Logger,
    ...productProviders,
    ...categoryProviders,
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
