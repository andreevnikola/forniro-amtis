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
  UseInterceptors,
} from '@nestjs/common';
import { CrudProductService } from './product.crud.service';
import { Product } from './data/product.interface';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/s3.service';

@Controller('product')
@ApiTags('Product Operations')
export class ProductsController {
  constructor(
    private readonly crud: CrudProductService,
    private readonly s3: S3Service,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: UpdateAndCreateResponseDTO,
  })
  @UseInterceptors(
    FileInterceptor('cover_photo', {
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
    }),
  )
  async createProduct(
    @Body() productFromDto: CreateAndUpdateProductDto,
    @UploadedFile() cover_photo: Express.Multer.File,
  ): Promise<UpdateAndCreateResponseDTO> {
    let uploaded = null;
    try {
      uploaded = await this.s3.uploadFile(cover_photo);
      if (!uploaded) throw new Error();
    } catch (e) {
      throw new HttpException('Unable to upload image to S3', 500);
    }

    const created = await this.crud.createProduct({
      ...productFromDto,
      cover_photo_url: uploaded.Location,
      photos: [],
      mark_as_new: productFromDto.mark_as_new ?? true,
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
      const success = await this.s3.deleteFile(cover_photo_url);

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

  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  @ApiParam({ name: 'id', required: true })
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.crud.deleteProduct(id);
    return;
  }
}
