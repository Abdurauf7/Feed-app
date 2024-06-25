// Third part Library
import express, { Express } from 'express';
import { json, urlencoded } from 'body-parser';
import multer from 'multer';
import path from 'path';
import helmet from 'helmet';
import { corsHandler,fileStorage,fileFilter } from './utils/helpers'
// import runServer from './utils/db' 
import mongoose from 'mongoose';
import CONFIG from './config';

const { APP, DB } = CONFIG;


// Routes
import feedRoutes from './routes/feed';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';

// configuration app
const app: Express = express();

// error Handlers
import { RouterErrorHandler } from './utils/helpers';


app.use('images', express.static(path.join(__dirname, 'images')));
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));

// parsing json
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true }));

// cors
app.use(corsHandler);
app.use(helmet());

// Routes
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

//  Error handling
app.use(RouterErrorHandler);

// runServer()
mongoose
.connect(`${DB.HOST}:${DB.PORT}/${DB.DATABASE}`)
.then(() => {
  app.listen(APP.PORT, () => {
    const io = require('./socket').init(app)
    io.on('connect',() =>{
      console.log("Socket connection");
    })
    console.log(`[server]: Server is running`);
  });
})
.catch((err) => console.log('Error while connecting to mongodb', err));
