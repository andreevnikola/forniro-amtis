import { Inject, Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { Product } from './data/product.interface';
import { equals } from 'class-validator';

@Injectable()
export class CrudProductService {
  constructor(
    @Inject('PRODUCT_MODEL') private readonly productModel: Model<Product>,
  ) {}

  async createProduct(product: Product): Promise<Product> {
    const createdProduct = new this.productModel(product);
    const created = await createdProduct.save();
    return created.toObject();
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();

    return {
      ...product.toObject(),
      current_price:
        product.original_price -
        product.original_price * (product.current_discount / 100),
    };
  }
}
