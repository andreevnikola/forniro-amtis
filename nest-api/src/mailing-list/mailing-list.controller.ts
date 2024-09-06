import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
} from '@nestjs/common';
import { MailingListService } from './mailing-list.service';
import { CreateMailingListDto } from './data/create-mailing-list.dto';
import { ApiOperation } from '@nestjs/swagger';
import { SendMailDto } from './data/send-mail.dto';

@Controller('mailing-list')
export class MailingListController {
  constructor(private readonly mailingListService: MailingListService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subscriber to the mailing list' })
  async create(@Body() createMailingListDto: CreateMailingListDto) {
    const { found } =
      await this.mailingListService.create(createMailingListDto);

    if (found) {
      throw new HttpException(
        'This email already exists in our mailing list',
        400,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscribers to the mailing list' })
  async findAll() {
    return await this.mailingListService.findAll();
  }

  @Get(':email/unsubscribe')
  async remove(@Param('email') email: string) {
    const success = await this.mailingListService.remove(email);

    if (!success) {
      throw new HttpException('Email not found in mailing list', 404);
    }
  }

  @Post('send')
  @ApiOperation({ summary: 'Send an email to all subscribers' })
  async sendEmail(@Body() sendDto: SendMailDto) {
    return await this.mailingListService.sendEmail(
      sendDto.subject,
      sendDto.body,
    );
  }
}
