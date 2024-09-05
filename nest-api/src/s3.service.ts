import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as sharp from 'sharp';

@Injectable()
export class S3Service {
  constructor(private readonly logger: Logger) {}

  AWS_S3_BUCKET = process.env.S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });

  async uploadFile(
    file: Express.Multer.File,
    props?: {
      prefix?: string;
      compression?: {
        compressWidth?: number;
        aspectRatio?: [number, number];
        quality?: number;
      };
    },
  ) {
    const { compression, prefix } = props ?? {};
    const { originalname } = file;

    let compressedBuffer = file.buffer;

    if (compression && compression.compressWidth) {
      try {
        if (compression.aspectRatio)
          compressedBuffer = await sharp(file.buffer)
            .resize(
              compression.compressWidth,
              Math.ceil(
                compression.compressWidth *
                  (compression.aspectRatio[1] / compression.aspectRatio[0]),
              ),
            )
            .jpeg({ quality: compression?.quality || 80 })
            .toBuffer();
        else
          compressedBuffer = await sharp(file.buffer)
            .resize(compression.compressWidth)
            .jpeg({ quality: compression?.quality || 80 })
            .toBuffer();
      } catch (e) {
        this.logger.error('Unable to compress image');
        console.error(e);
      }
    }

    return await this.s3_upload(
      compressedBuffer,
      this.AWS_S3_BUCKET,
      (prefix ? prefix : '') +
        '_' +
        (Math.random() + 1).toString(36).substring(15),
      file.mimetype,
    );
  }

  async deleteFile(location: string): Promise<boolean> {
    let params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: location.split('amazonaws.com/')[1],
    };

    try {
      await this.s3.deleteObject(params).promise();
      return true;
    } catch (e) {
      this.logger.error('Unable to delete image from S3');
      return false;
    }
  }

  private async s3_upload(file, bucket, name, mimetype) {
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
      this.logger.error('Unable to upload image to S3');
    }
  }
}
