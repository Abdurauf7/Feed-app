import express from 'express';
import { body } from 'express-validator';

import { getStatus, updateStatus } from '../controllers/user';
import { isAuth } from '../middleware/is-auth';

const router = express.Router();

router.get('/status', isAuth, getStatus);

router.put('/status', [body('status').trim().notEmpty()], isAuth, updateStatus);

export default router;
