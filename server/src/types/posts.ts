import { Request } from 'express';

export interface createPostIn {
  title: string;
  imageUrl: string;
  content: string;
  creator: creatortIn;
  createdAt: Date;
  updatedAt: Date;
}

export interface creatortIn {
  _id: string;
  email: string;
  password: string;
  name: string;
  status: string;
  posts: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
}
