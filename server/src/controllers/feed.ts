import fs from 'fs';
import {
  RequestHandler,
  Request,
  Response,
  NextFunction,
  Express,
} from 'express';
import { validationResult } from 'express-validator';

import path from 'path';
import Post from '../models/post';
import User from '../models/user';

export const getPosts: RequestHandler = async (req, res, next) => {
  const currentPage: number = parseInt(req.query.page as string, 10) || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate('creator')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      message: 'Success',
      posts,
      totalItems,
    });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

interface CustomRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
}

export const createPost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed' });
  }
  if (!req.file) {
    return res.status(422).json({ message: 'No image provided' });
  }
  const { title, content } = req.body;
  const imageUrl = req?.file.path;
  const post = new Post({
    title,
    content,
    imageUrl: imageUrl,
    creator: req.userId,
  });
  try {
    await post.save();
    const user = await User.findById(req.userId);
    user?.posts.push(post);
    await user?.save();
    // io.getIo().emit('posts', {
    //   action: 'create',
    //   post: { ...post._doc, creator: { _id: req.user_id, name: user.name } },
    // });
    res.status(201).json({
      message: 'Post added successfully',
      post: post,
      creator: { _id: user?._id, name: user?.name },
    });
  } catch (error: any) {
    if (!error) {
      error.message = 'status 500';
    }
    next(error);
  }
};
export const getPost: RequestHandler<{ postId: string }> = async (
  req,
  res,
  next
) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  try {
    if (!post) {
      return res.status(404).json({ message: 'Could not find post' });
    }
    res.status(200).json({ message: 'Post fetched', post });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const updatePost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed' });
  }
  const { postId } = req.params;
  const { title, content, image } = req.body;
  let imageUrl = image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    return res.status(422).json({ message: 'No file picked.' });
  }
  try {
    const post = await Post.findById(postId).populate('creator');
    if (!post) {
      return res.status(404).json({ message: 'Could not find post.' });
    }
    if (post?.creator?._id.toString() !== req?.userId) {
      return res.status(403).json({ message: 'Not authorized!' });
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    const result = await post.save();
    // io.getIo().emit('posts', { action: 'update', post: result });
    res.status(200).json({ message: 'Post updated', post: result });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deletePost = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Could not find post.' });
    }
    if (post.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized!' });
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndDelete(postId);
    const user = await User.findById(req.userId);
    user?.posts?.pull(postId);
    await user?.save();
    // io.getIo().emit('posts', { action: 'delete', post: postId });
    res.status(200).json({ message: 'Post Deleted' });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (filePath: string) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
