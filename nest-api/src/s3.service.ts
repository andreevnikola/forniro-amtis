import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class S3Service {
  constructor(private readonly logger: Logger) {}

  AWS_S3_BUCKET = process.env.S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });

  getUploadUrl;

  async uploadFile(file) {
    console.log(file);
    const { originalname } = file;

    try {
      return await this.s3_upload(
        file.buffer,
        this.AWS_S3_BUCKET,
        originalname,
        file.mimetype,
      );
    } catch (e) {
      Logger.error('Unable to upload image to S3');
      throw new Error('Unable to upload image to S3');
    }
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'eu-north-1',
      },
    };

    try {
      let s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
}
