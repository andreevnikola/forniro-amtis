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
import { ApiOperation, ApiParam } from '@nestjs/swagger';
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

    await this.mailingListService.sendEmail(
      'Welcome to our mailing list!',
      'You have successfully subscribed to our mailing list!. To unsubscribe go to the following url: ' +
        process.env.APP_LOCATION +
        '/api/' +
        createMailingListDto.email +
        '/unsubscribe',
      createMailingListDto.email,
    );
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
  @Post(':email/send')
  @ApiOperation({ summary: 'Send an email to a specific subscriber' })
  @ApiParam({ name: 'email', type: String, description: 'Subscriber email' })
  async sendEmailToSubscriber(
    @Param('email') email: string,
    @Body() sendDto: SendMailDto,
  ) {
    return await this.mailingListService.sendEmail(
      sendDto.subject,
      sendDto.body,
      email,
    );
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
