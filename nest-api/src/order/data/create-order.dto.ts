import { ApiProperty } from '@nestjs/swagger';
import { OrderAddress } from './order';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BoughtProductIds {
  @ApiProperty({
    name: 'id',
    type: String,
    description: 'The id of the bought product',
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    name: 'quantity',
    type: Number,
    description: 'The quantity of the bought product',
  })
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    name: 'first_name',
    type: String,
    description: 'First name of the order',
  })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    name: 'last_name',
    type: String,
    description: 'Last name of the order',
  })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    name: 'address',
    type: OrderAddress,
    description: 'Address of the order',
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OrderAddress)
  address: OrderAddress;

  @ApiProperty({
    name: 'phone_number',
    type: String,
    description: 'Phone number of the order',
  })
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    name: 'email',
    type: String,
    description: 'Email of the order',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    name: 'productIds',
    type: [BoughtProductIds],
    description: 'The ids of the oredered products',
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BoughtProductIds)
  productIds: BoughtProductIds[];
}
