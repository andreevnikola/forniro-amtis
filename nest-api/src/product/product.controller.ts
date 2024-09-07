import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CrudProductService } from './product.crud.service';
import { Product, Review } from './data/product.interface';
import {
  CreateAndUpdateProductDto,
  UpdateAndCreateResponseDTO,
  UpdateProductDto,
} from './data/product.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { S3Service } from 'src/s3.service';
import mongoose, { mongo } from 'mongoose';
import { CategoryService } from 'src/category/category.service';
import { ValidatedIdParam } from 'src/constants';
import { ProductReviewsService } from './product-reviews.service';

@Controller('product')
@ApiTags('Product Operations')
export class ProductsController {
  constructor(
    private readonly crud: CrudProductService,
    private readonly s3: S3Service,
    private readonly reviewService: ProductReviewsService,
  ) {}

  async populatePhotos(photos: Express.Multer.File[]): Promise<string[]> {
    try {
      return Promise.all(
        photos.map(async (photo) => {
          const uploaded = await this.s3.uploadFile(photo, {
            compression: {
              compressWidth: 1200,
              quality: 70,
              // aspectRatio: [16, 9],
            },
          });
          return uploaded.Location;
        }),
      );
    } catch (error) {
      throw new HttpException('Unable to upload new photos to S3', 500);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: UpdateAndCreateResponseDTO,
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'cover_photo',
        maxCount: 1,
      },
      { name: 'photos', maxCount: 10 },
    ]),
  )
  async createProduct(
    @Body() productFromDto: CreateAndUpdateProductDto,
    @UploadedFiles()
    files: {
      cover_photo: Express.Multer.File[];
      photos: Express.Multer.File[];
    },
  ): Promise<UpdateAndCreateResponseDTO> {
    const cover_photo = files.cover_photo[0];
    const photos = files.photos;

    let uploaded_compressed_cover, uploaded_fullsize_cover;
    try {
      uploaded_compressed_cover = await this.s3.uploadFile(cover_photo, {
        prefix: 'compressed',
        compression: {
          compressWidth: 550,
          aspectRatio: [16, 9],
          quality: 60,
        },
      });

      uploaded_fullsize_cover = await this.s3.uploadFile(cover_photo, {
        compression: {
          compressWidth: 1200,
          quality: 80,
          aspectRatio: [16, 9],
        },
      });
    } catch (error) {
      throw new HttpException('Unable to upload new cover image to S3', 500);
    }

    const photos_urls: string[] = await this.populatePhotos(photos);

    const created = await this.crud.createProduct({
      ...productFromDto,
      category: new mongoose.mongo.ObjectId(productFromDto.category),
      cover_photo_url: uploaded_fullsize_cover.Location,
      compressed_cover_photo_url: uploaded_compressed_cover.Location,
      photos: photos_urls,
      mark_as_new: productFromDto.mark_as_new ?? true,
      num_reviews: 0,
      reviews: [],
      avg_rating: 0,
    });

    return {
      id: created._id,
    };
  }

  @ApiOperation({ summary: 'Get product details' })
  @ApiResponse({
    status: 200,
    description: 'The Product with its details',
    type: Product,
  })
  @ApiParam({ name: 'id', required: true })
  @Get('/:id')
  async getProduct(@Param('id') id: string): Promise<Product> {
    return await this.crud.getProduct(id);
  }

  @ApiOperation({ summary: 'Update product details' })
  @ApiResponse({
    status: 200,
    description: 'The was succesfully updated',
    type: UpdateAndCreateResponseDTO,
  })
  @ApiParam({ name: 'id', required: true })
  @Patch('/:id')
  @UseInterceptors(FileInterceptor('cover_photo'))
  async updateProduct(
    @Param('id') id: string,
    @UploadedFile() cover_photo: Express.Multer.File,
    @Body() productFromDto: UpdateProductDto,
  ): Promise<UpdateAndCreateResponseDTO> {
    let uploaded_compressed_cover = null;
    let uploaded_fullsize_cover = null;
    const { cover_photo_url, compressed_cover_photo_url } =
      await this.crud.getProduct(id);
    if (cover_photo) {
      await this.s3.deleteFile(cover_photo_url);
      await this.s3.deleteFile(compressed_cover_photo_url);

      try {
        uploaded_compressed_cover = await this.s3.uploadFile(cover_photo, {
          prefix: 'compressed',
          compression: {
            compressWidth: 550,
            aspectRatio: [16, 9],
            quality: 60,
          },
        });

        uploaded_fullsize_cover = await this.s3.uploadFile(cover_photo, {
          compression: {
            compressWidth: 1200,
            quality: 80,
            aspectRatio: [16, 9],
          },
        });
      } catch (error) {
        throw new HttpException('Unable to upload new image to S3', 500);
      }
    }

    const updated = await this.crud.updateProduct(id, {
      ...productFromDto,
      compressed_cover_photo_url: uploaded_compressed_cover
        ? uploaded_compressed_cover.Location
        : compressed_cover_photo_url,
      cover_photo_url: uploaded_fullsize_cover
        ? uploaded_fullsize_cover.Location
        : cover_photo_url,
    });

    return {
      id: updated._id,
    };
  }

  @Post('/:id/photos')
  @ApiOperation({ summary: 'Add photo to a product' })
  @ApiResponse({
    status: 200,
    description: 'Photo added successfully',
  })
  @ApiParam({ name: 'id', required: true })
  @UseInterceptors(FileInterceptor('photo'))
  async addPhoto(
    @Param('id') id: string,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<void> {
    const { photos } = await this.crud.getProduct(id);
    const new_photos = await this.populatePhotos([photo]);
    const updated_photos = [...photos, ...new_photos];

    await this.crud.updateProduct(id, { photos: updated_photos });
    return;
  }

  @Delete('/:id/photos/:photo_id')
  @ApiOperation({ summary: 'Delete a photo from a product' })
  @ApiResponse({
    status: 200,
    description: 'Photo deleted successfully',
  })
  @ApiParam({ name: 'id', required: true })
  @ApiParam({
    name: 'photo_id',
    required: true,
    description:
      'A photo id is the part from the image url after amazonaws.com/',
  })
  async deletePhoto(
    @Param('id') id: string,
    @Param('photo_id') photo_id: string,
  ): Promise<void> {
    const { photos } = await this.crud.getProduct(id);
    const updated_photos = photos.filter(
      (photo) =>
        photo !==
        'https://furniro-amtis.s3.eu-north-1.amazonaws.com/' + photo_id,
    );

    const success = await this.s3.deleteFile(photo_id);
    if (!success) {
      throw new HttpException('Photo ID is wrong', 404);
    }

    await this.crud.updateProduct(id, { photos: updated_photos });
    return;
  }

  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  @ApiParam({ name: 'id', required: true })
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    const deleted = await this.crud.deleteProduct(id);
    if (!deleted) throw new HttpException('Product not found', 404);

    await this.s3.deleteFile(deleted.compressed_cover_photo_url);
    await this.s3.deleteFile(deleted.cover_photo_url);
    await Promise.all(deleted.photos.map((photo) => this.s3.deleteFile(photo)));

    return;
  }

  @Post('/:id/review')
  @ApiOperation({
    summary: 'Add a review to a product',
    description: 'Add a review to a product',
  })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Review added successfully',
  })
  async addReview(@Param() params: ValidatedIdParam, @Body() review: Review) {
    const success = await this.reviewService.createReview(params.id, review);
    if (!success.found) {
      throw new HttpException('Product not found', 404);
    }
    if (!success.success) throw new HttpException('Review not added', 500);

    return;
  }
}
