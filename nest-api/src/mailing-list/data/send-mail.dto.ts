import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendMailDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Subject of the email',
    example: 'Welcome to our mailing list',
  })
  subject: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Body of the email',
    example: 'Thank you for subscribing to our mailing list',
  })
  body: string;
}
