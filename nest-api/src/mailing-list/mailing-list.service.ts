import { Inject, Injectable } from '@nestjs/common';
import { CreateMailingListDto } from './data/create-mailing-list.dto';
import { Model } from 'mongoose';
import { MailingList } from './data/mailing-list.entity';
import { FoundAndSucessObject } from 'src/constants';

@Injectable()
export class MailingListService {
  constructor(
    @Inject('MAILING_LIST_MODEL')
    private readonly mailingListModel: Model<MailingList>,
  ) {}

  async create(
    createMailingListDto: CreateMailingListDto,
  ): Promise<FoundAndSucessObject> {
    try {
      const found = await this.findByEmail(createMailingListDto.email);
      if (!found) throw new Error();
      return { found: true, success: false };
    } catch {
      const createdMailingList = new this.mailingListModel(
        createMailingListDto,
      );
      await createdMailingList.save();
      return { found: false, success: true };
    }
  }

  async findAll() {
    return await this.mailingListModel.find().exec();
  }

  async findByEmail(email: string) {
    return await this.mailingListModel.findOne({ email: email }).exec();
  }

  async findOne(id: number) {
    return await this.mailingListModel.findById(id).exec();
  }

  async remove(mail: string) {
    const deleted = await this.mailingListModel
      .deleteOne({ email: mail })
      .exec();
    return deleted.deletedCount > 0;
  }
}
