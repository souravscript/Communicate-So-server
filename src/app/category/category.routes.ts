import { Router } from 'express';
import { create, getAll, getById } from './category.controller';
import { isAuthenticated } from '../../middlewares/authValidate';
import { isAdmin } from '../../middlewares/adminCheck';

const router = Router();

// Category routes with authentication
router.get('/', isAuthenticated, getAll);
router.get('/:id', isAuthenticated, getById);
router.post('/', isAuthenticated, isAdmin, create);

export default router;
