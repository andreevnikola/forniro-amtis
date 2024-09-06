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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  CreateCategoryResponse,
} from './data/create-category.dto';
import { UpdateCategoryDto } from './data/update-category.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { S3Service } from 'src/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongoose';
import { CrudProductService } from 'src/product/product.crud.service';

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
      throw new HttpException('Please provide a valid product id', 400);
    }

    return { id: created._id };
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
