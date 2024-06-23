import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/auth';
import jwt from 'jsonwebtoken';

export const isAuth = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'Not authenticate' });
  }
  const token = authHeader.split(' ')[1];
  let decodedToken: any & { userId: string };

  try {
    decodedToken = jwt.verify(token, `${process.env.DB_SECRET}`);
  } catch (err: any) {
    err.message = '500 error while decode jwt';
    throw err;
  }

  if (!decodedToken) {
    return res.status(401).json({ message: 'Not authenticate' });
  }
  req.userId = decodedToken.userId;
  next();
};
