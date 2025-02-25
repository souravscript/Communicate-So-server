import { prisma } from '../../utils/prisma';

interface CreateQueryInput {
  content: string;
  platform: string;
  response?: string;
  metadata?: Record<string, any>;
}

interface QueryStats {
  total: number;
  byPlatform: Record<string, number>;
}

export const createQuery = async (input: CreateQueryInput, userId: string) => {
  try {
    const query = await prisma.query.create({
      data: {
        content: input.content,
        platform: input.platform,
        response: input.response,
        metadata: input.metadata || {},
        createdBy: userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
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
        user: {
          select: {
            id: true,
            name: true,
            email: true
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
    const query = await prisma.query.findUnique({
      where: {
        id: queryId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!query) {
      throw new Error('Query not found');
    }

    // Only allow access to own queries
    if (query.createdBy !== userId) {
      throw new Error('Unauthorized access to query');
    }

    return query;
  } catch (error) {
    console.error('Error in getQueryById:', error);
    throw error;
  }
};

export const getThisWeekStats = async (userId: string): Promise<QueryStats> => {
  try {
    // Get the start of the current week (Sunday)
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Get queries for this week
    const queries = await prisma.query.findMany({
      where: {
        createdBy: userId,
        createdAt: {
          gte: startOfWeek,
          lte: now
        }
      },
      select: {
        platform: true
      }
    });

    // Calculate statistics
    const byPlatform: Record<string, number> = {};
    queries.forEach(query => {
      byPlatform[query.platform] = (byPlatform[query.platform] || 0) + 1;
    });

    return {
      total: queries.length,
      byPlatform
    };
  } catch (error) {
    console.error('Error in getThisWeekStats:', error);
    throw error;
  }
};
