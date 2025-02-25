import { Request, Response } from 'express';
import { createMember, getAllMembers, getMemberById } from './member.service';
import { UserRole } from '@prisma/client';

export const create = async (req: Request, res: Response) => {
  try {
    const { name, categoryName } = req.body;

    if (!name || !categoryName) {
      return res.status(400).json({ 
        error: 'Name and category name are required' 
      });
    }

    // Validate role if provided
    // if (role && !Object.values(UserRole).includes(role)) {
    //   return res.status(400).json({
    //     error: 'Invalid role provided'
    //   });
    // }

    const member = await createMember(name, categoryName);
    res.status(201).json({ message: 'Member created successfully', member });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create member' });
    }
  }
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const members = await getAllMembers();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
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

// export const updateCategories = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { categoryIds } = req.body;

//     if (!categoryIds || !Array.isArray(categoryIds)) {
//       return res.status(400).json({ 
//         error: 'categoryIds must be provided as an array' 
//       });
//     }

  //   const member = await updateMemberCategories(id, categoryIds);
  //   res.json({ message: 'Member categories updated successfully', member });
  // } catch (error) {
  //   if (error instanceof Error) {
  //     res.status(400).json({ error: error.message });
  //   } else {
  //     res.status(500).json({ error: 'Failed to update member categories' });
  //   }
  // }
  //};

// export const updateRole = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { role } = req.body;

//     if (!role || !Object.values(UserRole).includes(role)) {
//       return res.status(400).json({ 
//         error: 'Valid role must be provided' 
//       });
//     }

//     const member = await updateMemberRole(id, role as UserRole);
//     res.json({ message: 'Member role updated successfully', member });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(400).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: 'Failed to update member role' });
//     }
//   }
// };
