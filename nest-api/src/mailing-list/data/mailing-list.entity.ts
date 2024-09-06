import { ApiProperty } from '@nestjs/swagger';

export class MailingList {
  @ApiProperty({
    description: 'The email of the user',
    example: 'andr.nikola.08@gmail.com',
  })
  email: string;
}
