import { RequestHandler,Request,Response,NextFunction } from 'express';
import { unlink } from 'fs';
import { join } from 'path';
import multer from 'multer';
import { errorHandler } from '../types/error';

export const clearImage = (filePath: string) => {
  filePath = join(__dirname, '../../', filePath);
  unlink(filePath, (err) => console.log(err));
};

export const errorsHandler = (status: number, message?: string | null) => {
  switch (status) {
    case 500:
      return {
        status,
        type: 'ServerError',
        message: { en: 'Internal server error' },
        error: message,
      };
    case 404:
      return {
        status,
        type: 'NotFound',
        message: { en: 'Not Found' },
        error: message,
      };
    case 403:
      return {
        status,
        type: 'Not authorized!',
        message: { en: 'Not authorized!' },
        error: message,
      };
    default:
      return {
        status,
        type: 'ServerError',
        message: { en: 'Internal server error' },
        error: message,
      };
  }
};

export const corsHandler:RequestHandler = (req,res,next) =>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}

export const fileStorage = multer.diskStorage({
  destination(req,file,cb){
    cb(null,'images')
  },
  filename(req,file,cb){
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
})

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const RouterErrorHandler = (err: errorHandler, req: Request, res: Response, next: NextFunction) => {
  if (err.status) {
    const error = errorsHandler(err.status);
    return res.status(error.status).json(error);
  }
  return res.status(500).json({ message: 'Interval Server Error' });
} 