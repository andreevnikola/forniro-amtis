import { Module } from '@nestjs/common';
import { MailingListService } from './mailing-list.service';
import { MailingListController } from './mailing-list.controller';
import { mailingListProviders } from './mailing-list.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MailingListController],
  providers: [MailingListService, ...mailingListProviders],
})
export class MailingListModule {}
