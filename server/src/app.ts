// Third part Library
import express, { Express, NextFunction, Request, Response } from 'express';
import { json, urlencoded } from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

// Routes
import feedRoutes from './routes/feed';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';

// env configuration
dotenv.config();

// configuration app
const app: Express = express();

// Configuration with files
const fileStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, '../src/images');
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (
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
console.log('dirname', path.join(__dirname, 'images'));
app.use(
  '../src/images',
  express.static(path.join(__dirname, '../src', 'images'))
);
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));

// parsing json
app.use(json());
app.use(urlencoded({ extended: true }));

// cors
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

//  Error handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

// Connection to mongodb
mongoose
  .connect(`${process.env.DB_HOST}/${process.env.DB_NAME}`)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`[server]: Server is running`);
    });
  })
  .catch((err) => console.log('Error while connecting to mongodb', err));
