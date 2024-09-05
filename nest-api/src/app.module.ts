import { Logger, Module } from '@nestjs/common';
import { ProductsModule } from './product/product.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';

@Module({
  imports: [ProductsModule, DatabaseModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [S3Service, Logger],
  exports: [DatabaseModule],
})
export class AppModule {}
