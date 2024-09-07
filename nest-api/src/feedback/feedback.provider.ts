import { Connection } from 'mongoose';
import { DB_CONN } from 'src/constants';
import { ProductSchema } from 'src/product/data/product.schema';
import { FeedbackSchema } from './data/feedback.schema';

export const feedbackProviders = [
  {
    provide: 'FEEDBACK_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Feedback', FeedbackSchema),
    inject: [DB_CONN],
  },
];
