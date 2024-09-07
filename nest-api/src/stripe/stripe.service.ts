import {
  Injectable,
  Logger,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import Stripe from 'stripe';
import { OrderService } from 'src/order/order.service';
import { CrudProductService } from 'src/product/product.crud.service';
import { OrderAddress } from 'src/order/data/order';
import { OrderCheckoutDto } from './data/order-checkout.dto';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    @Inject(forwardRef(() => OrderService))
    private readonly productService: CrudProductService,
    private readonly orderService: OrderService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
    process.env.STRIPE_WEBHOOK_SECRET;
  }

  // Create Stripe Checkout Session
  async createCheckoutSession(
    checkoutSessionDto: OrderCheckoutDto,
    successUrl: string,
    cancelUrl: string,
  ): Promise<Stripe.Checkout.Session> {
    try {
      var orderData = await this.orderService.findOne(checkoutSessionDto.id);
    } catch {
      throw new BadRequestException(
        `Order with ID ${checkoutSessionDto.id} not found`,
      );
    }

    const lineItems = await Promise.all(
      orderData.products.map(async (product) => {
        return {
          price_data: {
            currency: 'bgn',
            product_data: {
              name: product.name,
              description: product.shrot_description,
              images: [product.cover_photo_url], // Adjust image URL
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: product.quantity,
        };
      }),
    );

    // Save order details (product IDs, quantities) in metadata
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${successUrl}?session_id=${process.env.CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      customer_email: orderData.email,
      currency: 'bgn',
      metadata: {
        order_id: orderData._id.toString(),
        first_name: orderData.first_name,
        last_name: orderData.last_name,
        email: orderData.email,
        address_street: orderData.address.street,
        address_zip: orderData.address.zip,
        address_city: orderData.address.city,
        address_country: orderData.address.country,
        customer_phone_number: orderData.phone_number,
        products: JSON.stringify(orderData.products), // Store products as JSON
      },
    });

    return session;
  }

  // Handle Stripe Webhook
  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret,
      );
    } catch (err) {
      this.logger.error(
        `Webhook signature verification failed: ${err.message}`,
      );
      throw new BadRequestException('Invalid webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session; // Extract products from metadata

      await this.orderService.pay(session.metadata.order_id, session.id);
    }
  }
}
