import { prisma } from '../../../utils/prisma';

interface CreateDataSourceInput {
  name: string;
  isEnabled?: boolean;
}

export const createDataSource = async (input: CreateDataSourceInput) => {
  try {
    const existingDataSource = await prisma.dataSource.findUnique({
      where: { name: input.name }
    });

    if (existingDataSource) {
      throw new Error('Data source with this name already exists');
    }

    const dataSource = await prisma.dataSource.create({
      data: {
        name: input.name,
        isEnabled: input.isEnabled ?? true
      }
    });

    return dataSource;
  } catch (error) {
    console.error('Error in createDataSource:', error);
    throw error;
  }
};

export const getAllDataSources = async () => {
  try {
    return await prisma.dataSource.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  } catch (error) {
    console.error('Error in getAllDataSources:', error);
    throw error;
  }
};

export const getDataSourceById = async (id: string) => {
  try {
    const dataSource = await prisma.dataSource.findUnique({
      where: { id }
    });

    if (!dataSource) {
      throw new Error('Data source not found');
    }

    return dataSource;
  } catch (error) {
    console.error('Error in getDataSourceById:', error);
    throw error;
  }
};

export const updateDataSourceStatus = async (id: string, isEnabled: boolean) => {
  try {
    return await prisma.dataSource.update({
      where: { id },
      data: { isEnabled }
    });
  } catch (error) {
    console.error('Error in updateDataSourceStatus:', error);
    throw error;
  }
};

export const getLastFiveEnabledDataSources = async () => {
  try {
    return await prisma.dataSource.findMany({
      where: {
        isEnabled: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 5,
      select: {
        id: true,
        name: true,
        isEnabled: true,
        updatedAt: true,
        createdAt: true
      }
    });
  } catch (error) {
    console.error('Error in getLastFiveEnabledDataSources:', error);
    throw error;
  }
};
