import { ApiProperty } from '@nestjs/swagger';
import { ProductSchema } from './product.schema';
import mongoose, { Mongoose } from 'mongoose';

export class Product {
  category?: mongoose.Types.ObjectId;

  @ApiProperty({
    description: 'Unique identifier for the product',
    example: '603dcd527f1c2b3418baf7b6',
    required: false,
  })
  _id?: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Nike Running Shoes',
  })
  name: string;

  @ApiProperty({
    description: 'A brief description of the product',
    example: 'Comfortable running shoes for everyday use',
  })
  short_description: string;

  @ApiProperty({
    description: 'Detailed description of the product',
    example:
      'These running shoes provide excellent cushioning and support for long-distance runners...',
  })
  description: string;

  @ApiProperty({
    description: 'Original price of the product before any discounts',
    example: 150.0,
    type: Number,
  })
  original_price: number;

  @ApiProperty({
    description: 'Current discount percentage on the product',
    example: 20,
    type: Number,
  })
  current_discount: number;

  @ApiProperty({
    description: 'Final price of the product after applying the discount',
    example: 120.0,
    required: false,
    type: Number,
  })
  current_price?: number;

  @ApiProperty({
    description: 'Flag to mark the product as new',
    example: true,
    type: Boolean,
  })
  mark_as_new: boolean;

  @ApiProperty({
    description: "URL of the product's cover photo",
    example: 'https://example.com/photo.jpg',
  })
  cover_photo_url: string;

  @ApiProperty({
    description: 'Array of URLs of additional product photos',
    example: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
    ],
    type: [String],
  })
  photos: string[];

  @ApiProperty({
    description: 'Available sizes for the product',
    type: Array<String>,
  })
  avaliable_sizes: Size[];

  @ApiProperty({
    description: 'Available colors for the product',
    example: ['red', 'blue', 'black'],
    type: [String],
  })
  avaliable_colors: string[];

  compressed_cover_photo_url?: string;

  @ApiProperty({
    description: 'Date and time when the product was created',
    example: '2021-03-01T00:00:00.000Z',
  })
  createdAt?: Date;
}

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
