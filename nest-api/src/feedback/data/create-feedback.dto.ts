import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
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
}
