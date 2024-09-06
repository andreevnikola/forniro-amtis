import { Inject, Injectable } from '@nestjs/common';
import { CreateMailingListDto } from './data/create-mailing-list.dto';
import { Model } from 'mongoose';
import { MailingList } from './data/mailing-list.entity';
import { FoundAndSucessObject } from 'src/constants';
import { createTransport, Transport, Transporter } from 'nodemailer';

@Injectable()
export class MailingListService {
  transporter: Transporter;

  constructor(
    @Inject('MAILING_LIST_MODEL')
    private readonly mailingListModel: Model<MailingList>,
  ) {
    this.transporter = createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

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

  async sendEmail(subject: string, body: string, email?: string) {
    if (!email) {
      const subscribers = await this.findAll();

      await Promise.all(
        subscribers.map(
          async (recipient) =>
            await this.transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: recipient.email,
              subject,
              html: body,
            }),
        ),
      );
    } else {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html: body,
      });
    }

    return { success: true };
  }
}
