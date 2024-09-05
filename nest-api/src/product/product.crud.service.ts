import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { Product } from './data/product.interface';
import { equals } from 'class-validator';
import { UpdateProductDto } from './data/product.dto';

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

  async updateProduct(id: string, product: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      product,
      { new: true, runValidators: true },
    );

    return updatedProduct.toObject();
  }

  async deleteProduct(id: string): Promise<boolean> {
    const deleted = await this.productModel.findByIdAndDelete(id).exec();
    return !!deleted;
  }
}
