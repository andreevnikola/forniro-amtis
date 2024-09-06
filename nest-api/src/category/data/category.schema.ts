import mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema<Category>({
  name: String,
  cover_photo_url: String,
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

export interface Category {
  _id?: string;
  name: string;
  cover_photo_url: string;
  products: mongoose.Types.ObjectId[];
}
