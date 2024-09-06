import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsString,
  Length,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose, { ObjectId } from 'mongoose';

export class CreateCategoryDto {
  @ApiProperty({
    name: 'name',
    description: 'Name of the category',
    example: 'Furniture',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(55)
  name: string;

  // @Type(() => Array<String>)
  // @IsString({ each: true })
  // @ApiProperty({
  //   name: 'products',
  //   description: 'List of product ids for this category',
  //   type: [String],
  // })
  // products: string[];
}

export class CreateCategoryResponse {
  id: string;
}
