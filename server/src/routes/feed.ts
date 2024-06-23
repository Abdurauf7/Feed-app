import express from 'express';
import { body } from 'express-validator';

import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from '../controllers/feed';
import { isAuth } from '../middleware/is-auth';
const router = express.Router();

router.get('/posts', isAuth, getPosts);

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

router.get('/post/:postId', isAuth, getPost);

router.put(
  '/post/:postId',
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
  updatePost
);

router.delete('/post/:postId', isAuth, deletePost);

export default router;
