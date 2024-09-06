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
import { OrderAsResponse } from './data/order-as-response';

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
  async findOne(@Param() params: ValidatedIdParam): Promise<OrderAsResponse> {
    try {
      var order = await this.orderService.findOne(params.id);
    } catch (error) {
      throw new HttpException('Order not found', 404);
    }

    return {
      _id: order._id,
      address: order.address,
      email: order.email,
      currency: order.currency,
      products: order.products,
      first_name: order.first_name,
      last_name: order.last_name,
      overall_price: order.overall_price,
      phone_number: order.phone_number,
    };
  }
}
