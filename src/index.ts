import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from './router';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

process.env.NODE_ENV === 'production' &&
dotenv.config({ path: __dirname + `.env.${process.env.NODE_ENV}` });

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

app.use(express.static(path.join(__dirname, 'build')));

app.use('/', router());

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

process.env.NODE_ENV === 'production' ?
  server.listen(() => console.log('SERVER_URI', process.env.SERVER_URI)) :
  server.listen(4000, () => console.log('SERVER_URI', process.env.SERVER_URI));
