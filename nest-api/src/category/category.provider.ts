import { Connection } from 'mongoose';
import { DB_CONN } from 'src/constants';
import { CategorySchema } from './data/category.schema';

export const categoryProviders = [
  {
    provide: 'CATEGORY_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Category', CategorySchema),
    inject: [DB_CONN],
  },
];
