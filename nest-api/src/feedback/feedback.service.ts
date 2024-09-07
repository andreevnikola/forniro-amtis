import { Inject, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './data/create-feedback.dto';
import { Model } from 'mongoose';
import { Feedback } from './data/feedback.entity';
import { FoundAndSucessObject } from 'src/constants';

@Injectable()
export class FeedbackService {
  constructor(
    @Inject('FEEDBACK_MODEL') private readonly feedbackModel: Model<Feedback>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    const created = await new this.feedbackModel(createFeedbackDto);
    await created.save();
  }

  async findAll() {
    return await this.feedbackModel
      .find({
        is_deleted: false,
      })
      .exec();
  }

  async remove(
    id: string,
    hard_delete: boolean,
  ): Promise<FoundAndSucessObject> {
    if (hard_delete) {
      const deleted = await this.feedbackModel.deleteOne({ _id: id });
      if (deleted.deletedCount === 0) {
        return { found: false, success: false };
      }
      return { found: true, success: true };
    }
    try {
      const deleted = await this.feedbackModel.findByIdAndUpdate(id, {
        is_deleted: true,
      });
      return { found: true, success: true };
    } catch {
      return { found: false, success: false };
    }
  }
}
