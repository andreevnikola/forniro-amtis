import { Module } from '@nestjs/common';
import { ProductsModule } from './product/product.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ProductsModule, DatabaseModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
  exports: [DatabaseModule],
})
export class AppModule {}
