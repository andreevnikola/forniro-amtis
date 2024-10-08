import { Inject, Injectable } from '@nestjs/common';
import { BoughtProductIds, CreateOrderDto } from './data/create-order.dto';
import { UpdateOrderDto } from './data/update-order.dto';
import { OrderSchema } from './data/order.schema';
import { Model } from 'mongoose';
import { Order, OrderedProduct } from './data/order';
import { FoundAndSucessObject } from 'src/constants';
import { Product } from 'src/product/data/product.interface';
import { MailingListService } from 'src/mailing-list/mailing-list.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_MODEL') private readonly orderModel: Model<Order>,
    @Inject('PRODUCT_MODEL') private readonly productModel: Model<Product>,
    private readonly mailingListService: MailingListService,
  ) {}

  async getRelatedProducts(
    productIds: BoughtProductIds[],
  ): Promise<Array<OrderedProduct>> {
    const relatedProducts = await this.productModel
      .find({ _id: { $in: productIds.map((productId) => productId.id) } })
      .exec();

    if (!relatedProducts) {
      return [];
    }

    return relatedProducts.map((product) => {
      console.log('product', product._id);
      return {
        product: product._id,
        quantity:
          productIds.find((p) => p.id === product._id.toString()).quantity || 1,
        cover_photo_url: product.cover_photo_url,
        name: product.name,
        price: product.original_price * (1 - product.current_discount / 100),
        shrot_description: product.short_description,
      };
    });
  }

  async create(
    producIds: BoughtProductIds[],
    createOrderDto: CreateOrderDto,
  ): Promise<FoundAndSucessObject> {
    let relatedProducts: Array<OrderedProduct> =
      await this.getRelatedProducts(producIds);

    if (relatedProducts.length !== producIds.length) {
      return { found: false, success: false };
    }

    const overall_price = relatedProducts.reduce(
      (acc: number, curr: OrderedProduct) => {
        console.log(curr.price, curr.quantity);
        return acc + curr.price * curr.quantity;
      },
      0,
    );

    const createdOrder = new this.orderModel({
      ...createOrderDto,
      products: relatedProducts,
      payed: false,
      currency: 'bgn',
      overall_price: overall_price,
    });
    const created = await createdOrder.save();

    return { found: true, success: true };
  }

  findOne(id: string) {
    return this.orderModel.findById(id).exec();
  }

  async delete(id: string): Promise<FoundAndSucessObject> {
    try {
      var order = await this.orderModel.findById(id).exec();
    } catch {
      return { found: false, success: false };
    }

    if (order.payed) {
      const updated = await this.orderModel
        .findByIdAndUpdate(id, { refunded: true })
        .exec();

      return { found: true, success: true };
    }

    try {
      const deleted = await this.orderModel.findByIdAndDelete(id).exec();
    } catch {
      return { found: true, success: false };
    }

    return { found: true, success: true };
  }

  async pay(id: string, payment_intent: string): Promise<boolean> {
    try {
      const updated = await this.orderModel
        .findByIdAndUpdate(id, { payed: true, payment_intent: payment_intent })
        .exec();

      await this.mailingListService.sendEmail(
        'Payment has been made sucessfully',
        `The payment for your order with an overall price tag of ${updated.overall_price}BGN has been accepted.`,
        updated.email,
      );

      return true;
    } catch (error) {
      return false;
    }
  }
}
