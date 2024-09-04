import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product } from './data/product.interface';

@Injectable()
export class CrudProductService {
  constructor(
    @Inject('PRODUCT_MODEL') private readonly productModel: Model<Product>,
  ) {}

  createProduct(): Promise<Product> {
    const createdProduct = new this.productModel({
      name: 'Product 1',
    });
    return createdProduct.save();
  }
}
