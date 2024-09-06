import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './data/create-order.dto';
import { UpdateOrderDto } from './data/update-order.dto';
import { ValidatedIdParam } from 'src/constants';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Order Operations')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const { found, success } = await this.orderService.create(
      createOrderDto.productIds,
      createOrderDto,
    );
    if (!found) {
      throw new HttpException('One or more products not found', 404);
    }
    if (!success) {
      throw new HttpException('Order creation failed', 500);
    }

    return;
  }

  @Get(':id')
  findOne(@Param() params: ValidatedIdParam) {
    return this.orderService.findOne(params.id);
  }
}
