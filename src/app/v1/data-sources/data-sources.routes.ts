import express from 'express';
import { create, getAll, getById, updateStatus, getLastFiveEnabled } from './data-sources.controller';
import { isAuthenticated } from '../../../middlewares/authValidate';
import { isAdmin } from '../../../middlewares/adminCheck';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Admin-only routes
router.post('/', isAdmin, create);  // Only admins can create data sources
router.patch('/:id/status', isAdmin, updateStatus);  // Only admins can update status

// Routes accessible by all authenticated users
router.get('/', getAll);
router.get('/recent-enabled', getLastFiveEnabled);  // New endpoint for recent enabled sources
router.get('/:id', getById);

export default router;
