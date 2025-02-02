import mongoose, { Schema } from 'mongoose';

import { createUserIn } from '../types/user';

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "I'm new user",
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
},{timestamps:true});

export default mongoose.model<createUserIn>('Users', UserSchema);
