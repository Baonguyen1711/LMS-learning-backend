import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class FileUploadService {
  private readonly client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: process.env.S3_REGION ?? 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY ?? 'replace-me',
        secretAccessKey: process.env.S3_SECRET_KEY ?? 'replace-me',
      },
    });
  }

  async uploadFile(file: Express.Multer.File, key: string) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET ?? 'lms-storage',
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    return { key, url: `https://${process.env.S3_BUCKET ?? 'lms-storage'}.s3.${process.env.S3_REGION ?? 'us-east-1'}.amazonaws.com/${key}` };
  }
}
