import { Inject, Injectable, Logger } from '@nestjs/common';
import { Product, Review } from './data/product.interface';
import { Model } from 'mongoose';

@Injectable()
export class ProductReviewsService {
  constructor(
    @Inject('PRODUCT_MODEL') private readonly productModel: Model<Product>,
    private readonly logger: Logger,
    // private readonly categoryService: CategoryService,
  ) {}

  async createReview(
    productId: string,
    review: Review,
  ): Promise<{ found: boolean; success: boolean }> {
    let product;
    try {
      product = await this.productModel.findById(productId).exec();
    } catch {
      return {
        found: false,
        success: false,
      };
    }

    console.log(review.rating);

    let updated;
    try {
      updated = await this.productModel
        .findByIdAndUpdate(productId, {
          $push: { reviews: review },
          avg_rating:
            (product.avg_rating *
              (product.num_reviews === 0 ? 1 : product.num_reviews) +
              review.rating) /
            (product.num_reviews + 1),
          num_reviews: product.num_reviews + 1,
        })
        .exec();
    } catch (e) {
      this.logger.error('Error creating new review' + e);
      return {
        found: true,
        success: false,
      };
    }

    return {
      found: true,
      success: true,
    };
  }
}
