import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OrderCheckoutDto {
  @ApiProperty({
    name: 'id',
    type: String,
    description: 'The id of the bought product',
  })
  @IsNotEmpty()
  id: string;
}
