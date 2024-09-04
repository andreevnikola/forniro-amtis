import { Controller, Post } from '@nestjs/common';
import { CrudProductService } from './crud.product.service';
import { Product } from './data/product.interface';

@Controller('product')
export class ProductsController {
  constructor(private readonly crud: CrudProductService) {}

  @Post()
  async createProduct(): Promise<Product> {
    return await this.crud.createProduct();
  }
}
