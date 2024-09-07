import { Connection } from 'mongoose';
import { DB_CONN } from 'src/constants';
import { ProductSchema } from 'src/product/data/product.schema';

export const productProviders = [
  {
    provide: 'PRODUCT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Product', ProductSchema),
    inject: [DB_CONN],
  },
];
