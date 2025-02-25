import { Request, Response } from 'express';
import { createQuery, getQueries, getQueryById, getThisWeekStats } from './queries.service';

export const createQueryHandler = async (req: Request, res: Response) => {
  try {
    const { content, platform, response, metadata } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!content || !platform) {
      return res.status(400).json({ error: 'Content and platform are required' });
    }

    const query = await createQuery({ content, platform, response, metadata }, userId);
    return res.status(201).json({ message: 'Query created successfully', query });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getQueriesHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const queries = await getQueries(userId);
    return res.json({ queries });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch queries' });
  }
};

export const getQueryByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const query = await getQueryById(id, userId);
    return res.json({ query });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Query not found') {
        return res.status(404).json({ error: error.message });
      } else if (error.message === 'Unauthorized access to query') {
        return res.status(403).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Failed to fetch query' });
      }
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getThisWeekStatsHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const stats = await getThisWeekStats(userId);
    return res.json(stats);
  } catch (error) {
    console.error('Error in getThisWeekStatsHandler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
