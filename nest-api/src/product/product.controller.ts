import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @UseInterceptors(FileInterceptor('cover_photo'))
  async createProduct(
    @Body() productFromDto: CreateAndUpdateProductDto,
    @UploadedFile() cover_photo: Express.Multer.File,
  ): Promise<UpdateAndCreateResponseDTO> {
    let uploaded = null;
    try {
      uploaded = await this.s3.uploadFile(cover_photo);
    } catch (e) {
      throw new HttpException('Unable to upload image to S3', 500);
    }

    if (!uploaded) {
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
  async updateProduct(
    @Param('id') id: string,
    @Body() productFromDto: UpdateProductDto,
  ): Promise<UpdateAndCreateResponseDTO> {
    const updated = await this.crud.updateProduct(id, productFromDto);

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
