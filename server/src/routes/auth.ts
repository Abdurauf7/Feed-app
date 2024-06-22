import express from 'express';

import { body } from 'express-validator';

import { signup, login } from '../controllers/auth';

import User from '../models/user';

const router = express.Router();

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('E-mail address already exists');
          }
        });
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().notEmpty(),
  ],
  signup
);

router.post('/login', login);

export default router;
