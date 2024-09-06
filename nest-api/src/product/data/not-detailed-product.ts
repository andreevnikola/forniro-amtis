import { ApiProperty } from '@nestjs/swagger';

export class NotDetailedProduct {
  @ApiProperty({
    name: 'Product ID',
    example: '603dcd527f1c2b3418baf7b6',
  })
  current_discount: number;

  @ApiProperty({
    name: 'Current price of the product (discounts apply)',
    example: 150.0,
    type: Number,
  })
  current_price: number;

  @ApiProperty({
    name: 'Description of the product',
    example:
      'These running shoes provide excellent cushioning and support for long-distance runners...',
  })
  short_description: string;

  @ApiProperty({
    name: 'Name of the product',
    example: 'Nike Running Shoes',
  })
  name: string;

  @ApiProperty({
    name: 'URL for the cover photo of the product',
    example: 'https://example.com/cover-photo.jpg',
  })
  cover_photo_url: string;

  @ApiProperty({
    name: 'Date and time when the product was created',
    example: '2021-03-01T00:00:00.000Z',
  })
  createdAt: Date;
}
