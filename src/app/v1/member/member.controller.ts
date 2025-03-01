import { Request, Response } from 'express';
import { createMember, getAllMembers, getMemberById } from './member.service';

export const create = async (req: Request, res: Response) => {
  try {
    const { name, categoryName } = req.body;

    if (!name || !categoryName) {
      res.status(400).json({ error: 'Name and category name are required' });
      return;
    }

    const member = await createMember({ name, categoryName });
    res.status(201).json({ message: 'Member created successfully', member });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const members = await getAllMembers();
    res.json({
      success: true,
      data: members
    });
  } catch (error) {
    console.error('Error in getAll controller:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch members',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const member = await getMemberById(id);
    res.json(member);
  } catch (error) {
    if (error instanceof Error && error.message === 'Member not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch member' });
    }
  }
};
