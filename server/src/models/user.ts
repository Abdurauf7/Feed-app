import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export type UserModel = mongoose.Document & {
  email: string;
  password: string;
  name: string;
  status: string;
  posts: Object[];
  createdAt: string;
  updatedAt: string;
};

const UserSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

// export default mongoose.model('User', UserSchema);
export default mongoose.model<UserModel>('User', UserSchema);
