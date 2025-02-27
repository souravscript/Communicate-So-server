import { Request, Response } from 'express';
import { createDataSource, getAllDataSources, getDataSourceById, updateDataSourceStatus } from './data-sources.service';

export const create = async (req: Request, res: Response) => {
  try {
    const { name, isEnabled } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const dataSource = await createDataSource({ name, isEnabled });
    res.status(201).json({ message: 'Data source created successfully', dataSource });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create data source' });
    }
  }
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const dataSources = await getAllDataSources();
    res.json(dataSources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data sources' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dataSource = await getDataSourceById(id);
    res.json(dataSource);
  } catch (error) {
    if (error instanceof Error && error.message === 'Data source not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch data source' });
    }
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isEnabled } = req.body;

    if (typeof isEnabled !== 'boolean') {
      return res.status(400).json({ error: 'isEnabled must be a boolean' });
    }

    const dataSource = await updateDataSourceStatus(id, isEnabled);
    res.json({ message: 'Data source status updated successfully', dataSource });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to update data source status' });
    }
  }
};
