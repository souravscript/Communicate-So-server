import { PutObjectCommand } from '@aws-sdk/client-s3';
import { ResourceType, AccessLevel } from '@prisma/client';
import s3Client from '../../../utils/s3Cllient';
import { prisma } from '../../../utils/prisma';

interface CreateResourceInput {
  name: string;
  type: ResourceType;
  url: string;
}

export async function uploadFile(file: Express.Multer.File, key: string) {
  const uploadParams = {
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
  } catch (err) {
    console.error('Error uploading to R2:', err);
    throw new Error(`Error uploading file: ${err}`);
  }
}

export const createResource = async (input: CreateResourceInput) => {
  try {
    return await prisma.resource.create({
      data: {
        title: input.name,
        type: input.type,
        url: input.url,
        accessLevel: AccessLevel.PUBLIC, // Default to public
        uploadedBy: '65de7f2c2cad4d001b6d5555', // TODO: Replace with actual user ID
      },
    });
  } catch (error) {
    console.error('Error in createResource:', error);
    throw error;
  }
};

export const getAllResources = async () => {
  try {
    return await prisma.resource.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        uploader: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error in getAllResources:', error);
    throw error;
  }
};

export const getResourceById = async (id: string) => {
  try {
    return await prisma.resource.findUnique({
      where: { id },
      include: {
        uploader: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error in getResourceById:', error);
    throw error;
  }
};
