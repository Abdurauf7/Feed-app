import {Request,Response,NextFunction,RequestHandler} from 'express'
import jwt from 'jsonwebtoken'

export = (req:Request & { userId:string }, res:Response, next:NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const err = new Error('Not authenticated');
    err.message = '401 not authenticated';
    throw err;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken: any & { userId:string };

  try {
    decodedToken = jwt.verify(token, `${process.env.DB_SECRET}`);
  } catch (err:any) {
    err.message = '500 error while decode jwt';
    throw err;
  }

  if (!decodedToken) {
    const err = new Error('Not authenticated');
    err.message = '401 Not authenticated';
    throw err;
  }
  req.userId = decodedToken.userId;
  next();
};
