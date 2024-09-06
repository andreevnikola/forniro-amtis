import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  CreateCategoryResponse,
} from './data/create-category.dto';
import { UpdateCategoryDto } from './data/update-category.dto';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { S3Service } from 'src/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongoose';
import { CrudProductService } from 'src/product/product.crud.service';
import { ValidatedIdParam } from 'src/constants';
import { CategoryDetailsResponse } from './data/category-details-response';
import { Category } from './data/category.schema';
import { CategoryDetailQueryParams } from './data/category-details-query-params';

@Controller('category')
@ApiTags('Category Operations')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: CrudProductService,
    private readonly s3: S3Service,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CreateCategoryResponse,
  })
  @UseInterceptors(FileInterceptor('cover_photo'))
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() uploadedCoverPhoto: Express.Multer.File,
  ): Promise<CreateCategoryResponse> {
    const coverPhoto = await this.s3.uploadFile(uploadedCoverPhoto, {
      compression: {
        quality: 70,
        compressWidth: 1500,
      },
    });

    let created;

    try {
      created = await this.categoryService.create(
        createCategoryDto,
        coverPhoto.Location,
      );
    } catch (e) {
      this.s3.deleteFile(coverPhoto.Key);
      throw new HttpException('Please provide a valid product id', 404);
    }

    return { id: created._id };
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'List of categories',
    type: [Category],
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'Get a category by id with its related products' })
  @ApiParam({ name: 'id', description: 'Category ID', required: true })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'price' })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    example: 'asc',
  })
  @ApiResponse({
    status: 200,
    description: 'Category found and returned',
    type: CategoryDetailsResponse,
  })
  async findOne(
    @Param() params: ValidatedIdParam,
    @Query() query: CategoryDetailQueryParams,
  ): Promise<CategoryDetailsResponse> {
    // console.log(params.id);
    const category = await this.categoryService.findOne(
      params.id,
      query.limit || 16,
      query.page || 1,
      query.sortBy || 'newest',
      query.sortOrder || 'desc',
    );
    if (!category) {
      throw new HttpException('Category not found', 404);
    }
    return category as CategoryDetailsResponse;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category by id' })
  @ApiParam({ name: 'id', description: 'Category ID', required: true })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
  })
  @UseInterceptors(FileInterceptor('cover_photo'))
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() uploadedCoverPhoto: Express.Multer.File,
  ) {
    let newCoverURL = null;
    if (uploadedCoverPhoto) {
      const coverPhoto = await this.s3.uploadFile(uploadedCoverPhoto, {
        compression: {
          quality: 70,
          compressWidth: 1500,
        },
      });

      newCoverURL = coverPhoto.Location;
    }

    const success = await this.categoryService.update(
      id,
      updateCategoryDto,
      newCoverURL,
    );
    if (!success) {
      throw new HttpException('Category not found', 404);
    }

    if (uploadedCoverPhoto) {
      await this.s3.deleteFile(success.cover_photo_url);
    }

    return;
  }

  @Delete(':id')
  async remove(@Param() params: ValidatedIdParam) {
    const old = await this.categoryService.findOne(params.id);

    const success = await this.categoryService.remove(params.id);
    if (!success) {
      throw new HttpException('Category not found', 404);
    }

    await this.productService.deleteByCategory(params.id);
    await this.s3.deleteFile(old.category.cover_photo_url);

    return;
  }
}
