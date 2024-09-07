import { ApiProperty } from '@nestjs/swagger';

export class Feedback {
  @ApiProperty({
    description: 'Feedback value',
    example: 5,
  })
  value: number;

  @ApiProperty({
    description: 'Feedback comment',
    example: 'Great service!',
  })
  comment: string;

  @ApiProperty({
    description: 'Feedback is deleted',
    example: false,
  })
  is_deleted: boolean;
}
