import express from 'express';
import { create, getAll, getById, uploadFileController } from './resource.controller';
import { isAuthenticated } from '../../../middlewares/authValidate';
import { isAdmin } from '../../../middlewares/adminCheck';
import upload from '../../../utils/multer';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Routes accessible by all authenticated users
router.get('/', getAll);
router.get('/:id', getById);

// File upload route
router.post('/upload', upload.array('files', 25), uploadFileController);

// Admin-only routes
router.post('/', isAdmin, create);

export default router;
