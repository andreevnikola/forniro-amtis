import { time } from 'console';
import { Feedback } from './feedback.entity';
import mongoose from 'mongoose';

export const FeedbackSchema = new mongoose.Schema<Feedback>(
  {
    value: Number,
    comment: String,
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);
