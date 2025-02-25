import express from 'express';
import { uploadFileController } from './resource.controller';
import upload from '../../utils/multer';
import { isAuthenticated } from '../../middlewares/authValidate';
//import { authenticateUser } from '../../middlewares/authValidate';

const router = express.Router();

router.post('/resource/upload', isAuthenticated, upload.array('files', 25), uploadFileController);

export default router;
