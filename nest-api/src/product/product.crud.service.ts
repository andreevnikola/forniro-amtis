import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import mongoose, { Model, ObjectId } from 'mongoose';
import { Product } from './data/product.interface';
import { equals } from 'class-validator';
import { UpdateProductDto } from './data/product.dto';
import { CategoryService } from 'src/category/category.service';
import { NotDetailedProduct } from './data/not-detailed-product';

@Injectable()
export class CrudProductService {
  constructor(
    @Inject('PRODUCT_MODEL') private readonly productModel: Model<Product>,
    // private readonly categoryService: CategoryService,
  ) {}

  async createProduct(product: Product): Promise<Product> {
    const createdProduct = new this.productModel(product);
    const created = await createdProduct.save();

    return created.toObject();
  }

  async findByCategory(
    categoryId: string,
    limit: number,
    page: number,
    sortBy: 'price' | 'newest' | 'name',
    sortOrder: 'asc' | 'desc',
  ): Promise<NotDetailedProduct[]> {
    const order = sortOrder === 'asc' ? 1 : -1;
    const products = await this.productModel
      .find({ category: new mongoose.mongo.ObjectId(categoryId) })
      .sort(
        sortBy === 'price'
          ? { original_price: order }
          : sortBy === 'newest'
            ? { createdAt: order }
            : { name: order },
      )
      .skip(limit * (page - 1))
      .limit(limit)
      .exec();
    return products.map((product) => ({
      name: product.name,
      short_description: product.short_description,
      cover_photo_url: product.cover_photo_url,
      current_discount: product.current_discount,
      createdAt: product.createdAt,
      avg_rating: product.avg_rating,
      num_reviews: product.num_reviews,
      current_price:
        product.original_price -
        product.original_price * (product.current_discount / 100),
    }));
  }

  async deleteByCategory(categoryId: string): Promise<boolean> {
    const deleted = await this.productModel
      .deleteMany({ category: new mongoose.mongo.ObjectId(categoryId) })
      .exec();
    if (deleted.deletedCount === 0) {
      return false;
    }
    return true;
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
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, product, { new: true, runValidators: true })
      .exec();

    return updatedProduct.toObject();
  }

  async deleteProduct(id: string): Promise<Product> {
    const deleted = await this.productModel.findByIdAndDelete(id).exec();
    return deleted.toObject();
  }

  async setCategory(
    id: string,
    categoryId: mongoose.mongo.ObjectId,
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, {
        category: categoryId,
      })
      .exec();
    return updatedProduct.toObject();
  }
}
