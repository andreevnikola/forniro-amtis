import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './data/create-category.dto';
import { UpdateCategoryDto } from './data/update-category.dto';
import mongoose, { Model } from 'mongoose';
import { Category } from './data/category.schema';
import { CrudProductService } from 'src/product/product.crud.service';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CATEGORY_MODEL') private readonly categoryModel: Model<Category>,
    private readonly productService: CrudProductService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, cover_photo_url: string) {
    // const castedProducts = createCategoryDto.products.map(
    //   (product) => new mongoose.mongo.ObjectId(product),
    // );
    const createdProduct = new this.categoryModel({
      name: createCategoryDto.name,
      cover_photo_url,
      products: [],
    });
    const created = await createdProduct.save();
    return created.toObject();
  }

  async addProductToCategory(
    categoryId: mongoose.mongo.ObjectId,
    productId: string,
  ) {
    const category = await this.categoryModel.findById(categoryId);
    const products = [
      ...category.toObject().products,
      new mongoose.mongo.ObjectId(productId),
    ];
    await this.categoryModel
      .findByIdAndUpdate(categoryId, {
        new: true,
        products: products,
      })
      .exec();
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
