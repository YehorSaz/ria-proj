import * as path from 'node:path';

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { UploadedFile } from 'express-fileupload';

import { configs } from '../configs/configs';

export enum EFileTypes {
  User = 'user',
  Car = 'car',
}

class S3Service {
  constructor(
    private s3Client = new S3Client({
      region: configs.AWS_S3_REGION,
      credentials: {
        accessKeyId: configs.AWS_S3_ACCESS_KEY,
        secretAccessKey: configs.AWS_S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
      endpoint: configs.AWS_S3_URL,
    }),
  ) {}

  public async uploadFile(
    file: UploadedFile,
    itemType: EFileTypes,
    itemId: string,
  ): Promise<string> {
    const filePath = `${itemType}/${itemId}/${randomUUID()}${path.extname(file.name)}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: configs.AWS_S3_BUCKET,
        Key: filePath,
        Body: file.data,
        ContentType: file.mimetype,
        ACL: 'public-read',
      }),
    );

    return filePath;
  }

  public async deleteFile(fileKey: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Key: fileKey,
        Bucket: configs.AWS_S3_BUCKET,
      }),
    );
  }
}

export const s3Service = new S3Service();
