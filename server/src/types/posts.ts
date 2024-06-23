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
