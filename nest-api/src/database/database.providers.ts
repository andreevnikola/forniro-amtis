import * as mongoose from 'mongoose';
import { DB_CONN } from 'src/constants';

export const databaseProviders = [
  {
    provide: DB_CONN,
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(process.env.DB_URL),
  },
];
