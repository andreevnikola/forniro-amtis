import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CrudProductService } from './product.crud.service';
import { Product } from './data/product.interface';
import {
  CreateAndUpdateProductDto,
  UpdateAndCreateResponseDTO,
  UpdateProductDto,
} from './data/product.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('product')
@ApiTags('Product Operations')
export class ProductsController {
  constructor(private readonly crud: CrudProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: UpdateAndCreateResponseDTO,
  })
  async createProduct(
    @Body() productFromDto: CreateAndUpdateProductDto,
  ): Promise<UpdateAndCreateResponseDTO> {
    const created = await this.crud.createProduct({
      ...productFromDto,
      mark_as_new: productFromDto.mark_as_new ?? true,
    });

    return {
      id: created._id.toString(),
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
}
