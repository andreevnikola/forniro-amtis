import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  Query,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './data/create-feedback.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new feedback' })
  @ApiResponse({
    status: 201,
    description: 'Feedback created successfully',
  })
  async create(@Body() createFeedbackDto: CreateFeedbackDto) {
    await this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedbacks' })
  @ApiResponse({
    status: 200,
    description: 'Feedbacks found and returned',
    type: [CreateFeedbackDto],
  })
  async findAll() {
    try {
      return await this.feedbackService.findAll();
    } catch (error) {
      throw new HttpException('Something went wrong', 500);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete feedback by id' })
  @ApiResponse({
    status: 200,
    description: 'Feedback deleted successfully',
  })
  @ApiQuery({ name: 'hard_delete', type: Boolean, description: 'Hard delete' })
  @ApiParam({ name: 'id', type: String, description: 'Feedback id' })
  async remove(
    @Param('id') id: string,
    @Query('hard_delete') hard_delete: boolean,
  ) {
    const { found, success } = await this.feedbackService.remove(
      id,
      hard_delete || false,
    );
    if (!found) {
      throw new HttpException('Feedback not found', 404);
    }
    if (!success) {
      throw new HttpException('Feedback deletion failed', 500);
    }
  }
}
