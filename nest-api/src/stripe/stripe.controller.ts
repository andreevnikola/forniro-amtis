import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { CreateOrderDto } from 'src/order/data/create-order.dto';
import { OrderCheckoutDto } from './data/order-checkout.dto';

@ApiTags('Payment')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-order-checkout-session')
  @ApiOperation({ summary: 'Create a new order checkout session' })
  async createCheckoutSession(
    @Body() checkoutSessionDto: OrderCheckoutDto,
    @Res() res: Response,
  ) {
    const successUrl = process.env.FRONTEND_SUCCESS_URL;
    const cancelUrl = process.env.FRONTEND_CANCEL_URL;

    const session = await this.stripeService.createCheckoutSession(
      checkoutSessionDto,
      successUrl,
      cancelUrl,
    );
    res.json({ id: session.id, url: session.url });
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
    @Res() res: Response,
  ) {
    const rawBody = req.body;

    try {
      await this.stripeService.handleWebhook(Buffer.from(rawBody), signature);
      res.sendStatus(200);
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}
