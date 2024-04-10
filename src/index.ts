import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from './router';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

process.env.NODE_ENV === 'production'?
  dotenv.config({ path:`.env.${process.env.NODE_ENV}`}):
  dotenv.config();
  
const app = express();
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.set('trust proxy', true);
bodyParser.urlencoded({ extended: true });
const server = http.createServer(app);


/**
 * 
 When connecting db to Atlas
 get your MONGO_URL from mongodb atlas websiste. find similar example in mern-exercise app
 */

mongoose.Promise = Promise;
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (error: Error) => console.error(error));

app.use(express.static(path.join(__dirname,'public')));
app.use('/', router());

app.get('*', (req, res)=>{
  res.sendFile(path.join('public', 'index.html'));
})

server.listen(process.env.PORT, () => console.log('SERVER_URI', process.env.SERVER_URI));
