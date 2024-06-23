import { Request } from 'express';
export interface createPostIn {
  title: string;
  imageUrl: string;
  content: string;
  creator: updatePostIn;
  createdAt: Date;
  updatedAt: Date;
}

export interface updatePostIn {
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
