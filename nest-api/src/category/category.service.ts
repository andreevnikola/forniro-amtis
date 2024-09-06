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
    });
    const created = await createdProduct.save();
    return created.toObject();
  }

  async findAll() {
    return await this.categoryModel.find().exec();
  }

  async findOne(
    id: string,
    limit?: number,
    page?: number,
    sortBy?: 'price' | 'newest' | 'name',
    sortOrder?: 'asc' | 'desc',
  ) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      return null;
    }
    if (limit)
      return {
        category: category.toObject(),
        products: await this.productService.findByCategory(
          category._id,
          limit,
          page,
          sortBy,
          sortOrder,
        ),
      };
    return {
      category: category.toObject(),
    };
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    newCoverURL: null | string,
  ) {
    console.log('updateCategoryDto', newCoverURL);
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, {
        ...updateCategoryDto,
        ...(newCoverURL && { cover_photo_url: newCoverURL }),
      })
      .exec();

    if (!updated) {
      return null;
    }
    return updated.toObject();
  }

  async remove(id: string) {
    const deleted = await this.categoryModel.deleteOne({ _id: id }).exec();
    if (deleted.deletedCount === 0) {
      return null;
    }

    await this.productService.deleteByCategory(id);
    return true;
  }
}
