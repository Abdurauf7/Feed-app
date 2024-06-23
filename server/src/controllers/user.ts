import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

interface CustomRequestHandler extends Request {
  userId?: string;
}

export const getStatus = async (
  req: CustomRequestHandler,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'Success', status: user.status });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const updateStatus = async (
  req: CustomRequestHandler,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed' });
  }
  const { status } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.status = status;
    await user.save();
    return res.status(200).json({ message: 'Success', status });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
