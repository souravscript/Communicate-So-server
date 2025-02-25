import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';
import { UserRole } from '@prisma/client';

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        role: true
      }
    });

    if (!user || user.role !== UserRole.Admin) {
      res.status(403).json({ error: 'Forbidden: Admin access required' });
      return;
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Internal server error during admin check' });
  }
};
