import { Request, Response } from 'express';
import { uploadFile } from './resource.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function uploadFileController(req: Request, res: Response): Promise<void> {
  if (!req.files || req.files.length === 0) {
    res.status(400).json({ message: 'No files uploaded' });
    return;
  }

  const files = req.files as Express.Multer.File[];
  const userId = (req as any).userId; // User ID from the authentication middleware
  const uploadResults = [];

  try {
    for (const file of files) {
      const key = file.originalname; // Use the original file name as the key
      await uploadFile(file, key);

      // Save file metadata in the database
      const resource = await prisma.resource.create({
        data: {
          title: file.originalname,
          type: 'PDF',
          url: `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ENDPOINT}/${key}`,
          accessLevel: 'PRIVATE',
          uploadedBy: userId,
          //companyId: "yourCompanyId", // Replace with the actual company ID
        },
      });

      uploadResults.push(resource);
    }
    res.status(200).json({ message: 'Files uploaded successfully', data: uploadResults });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ message: 'Failed to upload file', error: errorMessage });
  }
}
