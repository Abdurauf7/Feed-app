import mongoose, { Schema } from 'mongoose';
import { createPostIn } from '../types/posts';

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
},{timestamps:true});

export default mongoose.model<createPostIn>('Post', postSchema);
