import fs from "fs";
import { RequestHandler } from 'express'
import { validationResult } from "express-validator";
import path from "path";
import Post from '../models/post'

export const getPosts:RequestHandler = async (req,res,next) =>{
    const currentPage: number = parseInt(req.query.page as string, 10) || 1;
    const perPage = 2;
    try {
        const totalItems = await Post.find().countDocuments();
        const posts = await Post.find()
        //   .populate('creator')
          .sort({ createdAt: -1 })
          .skip((currentPage - 1) * perPage)
          .limit(perPage);
        res.status(200).json({
          message: 'Success',
          posts,
          totalItems,
        });
      } catch (err:any) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
}

export const createPost:RequestHandler = async (req,res,next) => {
    const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed');
    //     error.message = 'Status 422';
    //     throw error;
    // }
    // if (!req.file) {
    //     const error = new Error('No image provided');
    //     error.message = 'Status 422';
    //     throw error;
    // }
    const { title, content } = req.body;
    // const imageUrl = req.file.path;
    const post = new Post({
        title,
        content,
        imageUrl: 'test',
        // creator: req.userId,
    });
    try {
        await post.save();
        // const user = await User.findById(req.userId);
        // user.posts.push(post);
        // await user.save();
        // io.getIo().emit('posts', {
        //   action: 'create',
        //   post: { ...post._doc, creator: { _id: req.user_id, name: user.name } },
        // });
        res.status(201).json({
          message: 'Post added successfully',
          post: post,
    //       creator: { _id: user._id, name: user.name },
        });
    } catch (error:any) {
        if (!error) {
            error.message = "status 500";
        }
        next(error);
    }
}

const clearImage = (filePath:string) => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, (err) => console.log(err));
  };
  