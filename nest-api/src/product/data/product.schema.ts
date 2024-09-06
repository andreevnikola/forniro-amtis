import mongoose from 'mongoose';
import { Product } from './product.interface';

export const ProductSchema = new mongoose.Schema<Product>(
  {
    name: String,
    avaliable_colors: Array<String>,
    avaliable_sizes: Array<String>,
    cover_photo_url: String,
    current_discount: Number,
    description: String,
    mark_as_new: Boolean,
    original_price: Number,
    photos: Array<String>,
    short_description: String,
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
    } as any,
    compressed_cover_photo_url: String,
  },
  { timestamps: true },
);
