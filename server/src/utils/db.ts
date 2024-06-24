import mongoose from 'mongoose';
import CONFIG from '../config';
const { APP, DB } = CONFIG;
import express, { Express } from 'express';

const app: Express = express();

const connectionToMongo = () =>{
   
// Connection to mongodb

mongoose
.connect(`${DB.HOST}:${DB.PORT}/${DB.DATABASE}`)
.then(() => {
  app.listen(APP.PORT, () => {
    console.log(`[server]: Server is running`);
  });
})
.catch((err) => console.log('Error while connecting to mongodb', err));
}

export default connectionToMongo