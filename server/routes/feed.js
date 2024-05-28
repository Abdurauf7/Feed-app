const express = require('express');

const { body } = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/posts', isAuth, feedController.getPosts);

router.post(
  '/post',
  isAuth,
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
  feedController.createPost
);

router.get('/post/:postId', isAuth, feedController.getPost);

router.put(
  '/post/:postId',
  isAuth,
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
  feedController.updatePost
);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
