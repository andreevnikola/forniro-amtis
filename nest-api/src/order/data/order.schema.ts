import mongoose from 'mongoose';
import { Order } from './order';

export const OrderSchema = new mongoose.Schema<Order>(
  {
    overall_price: Number,
    currency: String,
    first_name: String,
    last_name: String,
    address: {
      street: String,
      city: String,
      country: String,
      zip: String,
    },
    phone_number: String,
    email: String,
    payed: Boolean,
    products: [
      {
        quantity: Number,
        name: String,
        price: Number,
        short_description: String,
        cover_photo_url: String,
      },
    ],
  },
  { timestamps: true },
);
