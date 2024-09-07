import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from '../data/create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
