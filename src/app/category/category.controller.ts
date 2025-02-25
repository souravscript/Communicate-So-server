import { Request, Response } from 'express';
import { createCategory, getAllCategories, getCategoryById } from './category.service';

export const create = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.body;

    if (!categoryName) {
      res.status(400).json({ error: 'Category name is required' });
      return;
    }

    const category = await createCategory(categoryName);
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);
    res.json({ category });
  } catch (error) {
    if (error instanceof Error && error.message === 'Category not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  }
};
