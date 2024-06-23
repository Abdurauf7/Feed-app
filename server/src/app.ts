// Third part Library
import express, { Express, NextFunction, Request, Response } from 'express';
import { json, urlencoded } from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import helmet from 'helmet';

// Routes
import feedRoutes from './routes/feed';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';

// env configuration

import CONFIG from './config';
const { APP, DB } = CONFIG;

// configuration app
const app: Express = express();

// error Handlers
import { errorsHandler } from './utils/helpers';

// Configuration with files
const fileStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'images');
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
app.use('images', express.static(path.join(__dirname, 'src', 'images')));
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));

// parsing json
app.use(json({ limit: '10mb' }));
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

app.use(helmet());

// Routes

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

//  Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.status) {
    const error: any = errorsHandler(err.status);
    return res.status(error.status).json(error);
  }
  return res.status(500).json({ message: 'Interval Server Error' });
});

// Connection to mongodb

mongoose
  .connect(`${DB.HOST}:${DB.PORT}/${DB.DATABASE}`)
  .then(() => {
    app.listen(APP.PORT, () => {
      console.log(`[server]: Server is running`);
    });
  })
  .catch((err) => console.log('Error while connecting to mongodb', err));
