import { Connection } from 'mongoose';
import { DB_CONN } from 'src/constants';
import { ProductSchema } from 'src/product/data/product.schema';
import { MailingListSchema } from './data/mailing-list.schema';

export const mailingListProviders = [
  {
    provide: 'MAILING_LIST_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('MailingList', MailingListSchema),
    inject: [DB_CONN],
  },
];
