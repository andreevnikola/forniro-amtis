import mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema<Category>({
  name: String,
  cover_photo_url: String,
});

export class Category {
  _id?: string;
  name: string;
  cover_photo_url: string;
}
