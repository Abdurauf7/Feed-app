import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import configs from '../config/';

const { JWT_SECRET, SESSION_TIMEOUT } = configs.APP;

import User from '../models/user';

export const signup: RequestHandler = async (req, res, next) => {
  console.log('HELLo')
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed', errors });
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
  } catch (err) {
    next({ status: 500 });
  }
};

export const login: RequestHandler = async (req, res, next) => {
  console.log('login HELLo')
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not Found' });
    }
    const isEqual = await bcrypt.compare(password, user?.password);

    if (!isEqual) {
      return res.status(401).json({ message: 'Wrong Password' });
    }
    const token = jwt.sign(
      {
        email: user?.email,
        userId: user?._id.toString(),
      },
      `${JWT_SECRET}`,
      { expiresIn: `${SESSION_TIMEOUT}` }
    );
    res.status(200).json({
      message: 'Success',
      token,
      userId: user?._id.toString(),
    });
    return;
  } catch (err) {
    return next({ status: 500 });
  }
};
