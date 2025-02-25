import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../../utils/s3Cllient';

export async function uploadFile(file: Express.Multer.File, key: string) {
  const uploadParams = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
    return { success: true, data: response };
  } catch (err) {
    throw new Error(`Error uploading file: ${err}`);
  }
}
