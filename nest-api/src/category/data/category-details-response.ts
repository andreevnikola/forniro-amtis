import { NotDetailedProduct } from 'src/product/data/not-detailed-product';
import { Category } from './category.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDetailsResponse {
  @ApiProperty({
    name: 'Infor about the category',
    type: Category,
  })
  category: Category;

  @ApiProperty({
    name: 'List of products in the category',
    type: [NotDetailedProduct],
  })
  products: NotDetailedProduct[];
}
