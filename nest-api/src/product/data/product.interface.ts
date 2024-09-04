export interface Product {
  _id?: string;
  name: string;
  short_description: string;
  description: string;
  original_price: number;
  current_discount: number;
  current_price?: number;
  mark_as_new: boolean;
  cover_photo_url: string;
  photos: string[];
  avaliable_sizes: Size[];
  avaliable_colors: string[];
}

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
