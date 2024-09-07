import { ApiProperty } from '@nestjs/swagger';
import { OrderAddress, OrderedProduct } from './order';

export class OrderAsResponse {
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
    name: 'products',
    type: [OrderedProduct],
    description: 'List of ordered products',
  })
  products: OrderedProduct[];
}
