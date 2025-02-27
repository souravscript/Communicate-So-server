import { Request, Response } from 'express';
import { createQuery, getQueries, getQueryById, getThisWeekStats } from './queries.service';

export const createQueryHandler = async (req: Request, res: Response) => {
  try {
    const { content, response, metadata, categoryName } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!content || !categoryName) {
      return res.status(400).json({ error: 'Content and category name are required' });
    }

    const query = await createQuery({ content, response, metadata, categoryName }, userId);
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



export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const query = await getQueryById(id, userId);
    res.json(query);
  } catch (error) {
    if (error instanceof Error && error.message === 'Query not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch query' });
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
