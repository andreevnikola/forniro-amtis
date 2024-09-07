import { Logger, Module } from '@nestjs/common';
import { ProductsModule } from './product/product.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { StripeModule } from './stripe/stripe.module';
import { MailingListModule } from './mailing-list/mailing-list.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ProductsModule,
    StripeModule,
    DatabaseModule,
    ConfigModule.forRoot(),
    CategoryModule,
    OrderModule,
    MailingListModule,
    FeedbackModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client'),
    }),
  ],
  controllers: [],
  providers: [S3Service, Logger],
  exports: [DatabaseModule],
})
export class AppModule {}
