import { prisma } from '../../../utils/prisma';

interface CreateQueryInput {
  content: string;
  response?: string;
  metadata?: Record<string, any>;
  categoryName: string;
}

interface QueryStats {
  total: number;
  byContent: Record<string, number>;
  byCategory: Record<string, number>;
}

export const createQuery = async (input: CreateQueryInput, userId: string) => {
  try {
    const category = await prisma.category.findFirst({
      where: {
        name: input.categoryName,
        userIds: {
          has: userId
        }
      }
    });

    if (!category) {
      throw new Error('Category not found or access denied');
    }

    const query = await prisma.query.create({
      data: {
        content: input.content,
        response: input.response,
        metadata: input.metadata || {},
        createdBy: userId,
        categoryId: category.id
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return query;
  } catch (error) {
    console.error('Error in createQuery:', error);
    throw error;
  }
};

export const getQueries = async (userId: string) => {
  try {
    return await prisma.query.findMany({
      where: {
        createdBy: userId
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error('Error in getQueries:', error);
    throw error;
  }
};

export const getQueryById = async (queryId: string, userId: string) => {
  try {
    const query = await prisma.query.findFirst({
      where: {
        id: queryId,
        createdBy: userId
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!query) {
      throw new Error('Query not found');
    }

    return query;
  } catch (error) {
    console.error('Error in getQueryById:', error);
    throw error;
  }
};

export const getThisWeekStats = async (userId: string): Promise<QueryStats> => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const queries = await prisma.query.findMany({
      where: {
        createdBy: userId,
        createdAt: {
          gte: startOfWeek,
          lte: now
        }
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });

    const byContent: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    queries.forEach(query => {
      const contentKey = query.content.substring(0, 50);
      byContent[contentKey] = (byContent[contentKey] || 0) + 1;

      const categoryName = query.category.name;
      byCategory[categoryName] = (byCategory[categoryName] || 0) + 1;
    });

    return {
      total: queries.length,
      byContent,
      byCategory
    };
  } catch (error) {
    console.error('Error in getThisWeekStats:', error);
    throw error;
  }
};
