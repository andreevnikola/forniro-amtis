import { ApiParam, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OrderAddress {
  @ApiProperty({
    name: 'street',
    type: String,
    description: 'Street of the address',
  })
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    name: 'city',
    type: String,
    description: 'City of the address',
  })
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    name: 'country',
    type: String,
    description: 'Country of the address',
  })
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    name: 'zip',
    type: String,
    description: 'Zip code of the address',
  })
  @IsNotEmpty()
  zip: string;
}

export class OrderedProduct {
  @ApiProperty({
    name: 'product',
    type: String,
    description: 'Product id',
  })
  quantity: number;

  @ApiProperty({
    name: 'name',
    type: String,
    description: 'Product name',
  })
  name: string;

  @ApiProperty({
    name: 'price',
    type: Number,
    description: 'Product price',
  })
  price: number;

  @ApiProperty({
    name: 'shrot_description',
    type: String,
    description: 'Product short description',
  })
  shrot_description: string;

  @ApiProperty({
    name: 'cover_photo_url',
    type: String,
    description: 'Product cover photo url',
  })
  cover_photo_url: string;
}

export class Order {
  @ApiProperty({
    name: 'user_id',
    type: String,
    description: 'User id of the order',
  })
  _id: string;

  @ApiProperty({
    name: 'overall_price',
    type: Number,
    description: 'Overall price of the order',
  })
  overall_price: number;

  @ApiProperty({
    name: 'currency',
    type: String,
    description: 'Currency of the order',
  })
  currency: string;

  @ApiProperty({
    name: 'first_name',
    type: String,
    description: 'First name of the order',
  })
  first_name: string;

  @ApiProperty({
    name: 'last_name',
    type: String,
    description: 'Last name of the order',
  })
  last_name: string;

  @ApiProperty({
    name: 'address',
    type: OrderAddress,
    description: 'Address of the order',
  })
  address: OrderAddress;

  @ApiProperty({
    name: 'phone_number',
    type: String,
    description: 'Phone number of the order',
  })
  phone_number: string;

  @ApiProperty({
    name: 'email',
    type: String,
    description: 'Email of the order',
  })
  email: string;

  @ApiProperty({
    name: 'payed',
    type: Boolean,
    description: 'Order payed or not payed',
  })
  payed: boolean;

  @ApiProperty({
    name: 'products',
    type: [OrderedProduct],
    description: 'List of ordered products',
  })
  products: OrderedProduct[];
}
