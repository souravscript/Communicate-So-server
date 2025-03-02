import { Router } from 'express';
import { 
  create, 
  getAll, 
  getById,
  deleteById,
  //updateCategories, 
  //updateRole 
} from './member.controller';
import { isAuthenticated } from '../../../middlewares/authValidate';
import { isAdmin } from '../../../middlewares/adminCheck';

const router = Router();

// All routes require authentication
router.use(isAuthenticated);

// Admin-only routes
router.post('/', isAdmin, create);  // Only admins can create members
router.delete('/:id', isAdmin, deleteById);  // Only admins can delete members
//router.patch('/:id/role', isAdmin, updateRole);  // Only admins can update roles

// Routes accessible by all authenticated users
router.get('/', getAll);
router.get('/:id', getById);
//router.patch('/:id/categories', updateCategories);

export default router;
