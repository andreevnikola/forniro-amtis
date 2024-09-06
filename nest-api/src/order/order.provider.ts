import { Connection } from 'mongoose';
import { DB_CONN } from 'src/constants';
import { ProductSchema } from 'src/product/data/product.schema';
import { OrderSchema } from './data/order.schema';

export const ordreProviders = [
  {
    provide: 'ORDER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Order', OrderSchema),
    inject: [DB_CONN],
  },
];
