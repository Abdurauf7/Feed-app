import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user';

export const signup: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.message = '422 Validation failed';
    // error.name = errors.array();
    throw error;
  }
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      name,
    });
    const result = await user.save();
    res.status(201).json({ message: 'User created', userId: result._id });
  } catch (err: any) {
    if (!err) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user: { _id: string; email: string; password: string } =
      await User.findOne({ email });
    if (!user) {
      const error = new Error('A user with email not found');
      error.message = '401 A user with email not found';
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error('Wrong password');
      error.message = '401 Wrong password';
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      `${process.env.DB_SECRET}`,
      { expiresIn: '1h' }
    );
    res.status(200).json({
      message: 'Success',
      token,
      userId: user._id.toString(),
    });
    return;
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};
