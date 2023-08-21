// src/app.ts
import express, { json, urlencoded } from "express";
import { RegisterRoutes } from './routes';
import swaggerUi = require('swagger-ui-express');
import fs from 'fs';
import cors from 'cors';
import mongoose from "mongoose";
import bodyparser from 'body-parser';


import './components/user/user.controller';
import './components/position/position.controller';
// import './components/book/book.controller';
// import './components/product/product.controller';
import './components/facility/facility.controller';
import './components/criteria/criteria.controller';
import './components/setOfQuestions/setOfQuestion.controller';
import './components/question/question.controller';
import './components/result/result.controller';




const app = express();


mongoose.connect(process.env.MONGO_DB ?? '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS,
  dbName: process.env.MONGO_DB_NAME,
}).then(() => console.log('Connected to mongodb')).catch(err => { console.log(process.env.MONGO_DB); console.log({ err }) });
// Use body parser to read sent json payloads



/* Swagger files start */
const swaggerFile: any = (process.cwd() + "/swagger.json");
const swaggerData: any = fs.readFileSync(swaggerFile, 'utf8');
const swaggerDocument = JSON.parse(swaggerData);
/* Swagger files end */



app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());

RegisterRoutes(app);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export { app };