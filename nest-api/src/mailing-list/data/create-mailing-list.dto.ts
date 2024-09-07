import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateMailingListDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of the user',
    example: 'andr.nikola.08@gmail.com',
  })
  email: string;
}
