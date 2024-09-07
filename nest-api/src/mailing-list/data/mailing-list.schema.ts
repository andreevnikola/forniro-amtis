import { timestamp } from 'rxjs';
import { MailingList } from './mailing-list.entity';
import mongoose from 'mongoose';

export const MailingListSchema = new mongoose.Schema<MailingList>(
  {
    email: String,
  },
  { timestamps: true },
);
