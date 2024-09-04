import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Size } from './product.interface';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateAndUpdateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Kitchen Chair',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(512)
  name: string;

  @ApiProperty({
    description:
      'The short description that summerizes the products in up to 50 words',
    example:
      'This is a modern chair inspired by the school of art deco that is perfect for your kitchen.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(512)
  short_description: string;

  @ApiProperty({
    description: 'This is the enirity of the product description',
    example: 'This chair is made from the highes class of pathagonian wood...',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  original_price: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  current_discount: number = 0;

  @ApiProperty({
    description: 'Mark as new product',
    example: true,
    nullable: true,
  })
  mark_as_new: boolean | null = null;

  @ApiProperty({
    description: 'URL of the cover photo',
    example: 'http://example.com/photo.jpg',
  })
  @IsString()
  @IsNotEmpty()
  cover_photo_url: string;

  @ApiProperty({
    description: 'List of photo URLs',
    type: [String],
    example: ['http://example.com/photo1.jpg', 'http://example.com/photo2.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  photos: string[];

  @ApiProperty({
    description: 'List of available sizes',
    type: [String],
    example: ['S', 'M', 'L'],
  })
  @IsArray()
  @IsString({ each: true })
  avaliable_sizes: Size[];

  @ApiProperty({
    description: 'List of available colors',
    type: [String],
    example: ['red', 'blue', 'green'],
  })
  @IsArray()
  @IsString({ each: true })
  avaliable_colors: string[];
}

export class UpdateAndCreateResponseDTO {
  @ApiProperty({
    description: 'Rhis is the id of the created / updated element',
    example: '66d86ce4f8ddf0f964e91df9',
    type: String,
  })
  id: String;
}

export class UpdateProductDto extends PartialType(CreateAndUpdateProductDto) {}
