import express from 'express';
import { body } from 'express-validator';

import { getPosts, createPost } from '../controllers/feed';
import { isAuth } from '../middleware/is-auth';
const router = express.Router();

router.get('/posts', getPosts);

router.post(
  '/post',
  [
    body('title', 'The title should be more than 5 character')
      .isLength({
        min: 5,
      })
      .isString()
      .trim(),
    body('content', 'The content should be more than 5 character')
      .isLength({
        min: 5,
      })
      .isString()
      .trim(),
  ],
  isAuth,
  createPost
);

export default router;
