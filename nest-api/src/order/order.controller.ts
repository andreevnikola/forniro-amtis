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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderAsResponse } from './data/order-as-response';
import { StripeService } from 'src/stripe/stripe.service';

@ApiTags('Order Operations')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly stripeService: StripeService,
  ) {}

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
  @ApiOperation({ summary: 'Get order by id' })
  @ApiResponse({
    status: 200,
    description: 'Order found and returned',
    type: OrderAsResponse,
  })
  @ApiParam({ name: 'id', type: String, description: 'Order id' })
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order by id' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiParam({ name: 'id', type: String, description: 'Order id' })
  async remove(@Param() params: ValidatedIdParam) {
    const success = await this.orderService.delete(params.id);
    if (!success.found) {
      throw new HttpException('Order deletion failed', 500);
    }
    if (!success.success) {
      throw new HttpException('Something went wrong', 500);
    }
    return;
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Get a refund on your order' })
  @ApiParam({ name: 'id', type: String, description: 'Order id' })
  @ApiResponse({ status: 200, description: 'Refund successful' })
  async refund(@Param() params: ValidatedIdParam) {
    const success = await this.stripeService.refundOnOrderCancelation(
      params.id,
    );
    if (!success.found) {
      throw new HttpException('Order not found', 404);
    }
    if (!success.success) {
      throw new HttpException('Refund failed', 500);
    }
    return;
  }
}
