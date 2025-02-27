import express from 'express';
import { logout, signin, signup } from './auth.controller';
import { signupSchema } from './auth.validator';
import { validateRequest } from '../../../middlewares/validate';

const router = express.Router();

router.post('/signup', validateRequest(signupSchema), signup);
router.post('/signin', signin);
router.post('/logout', logout);

export default router;
//8000855731
