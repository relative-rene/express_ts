import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from './router';
import 'dotenv/config'
import mongoose from 'mongoose';
import path from 'path';

const app = express();

app.use(cors({credentials:true}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
bodyParser.urlencoded({ extended: true });
const server = http.createServer(app);


/**
 * 
 When connecting db to Atlas
 get your MONGO_URL from mongodb atlas websiste. find similar example in mern-exercise app
 */

if(process.env.NODE_ENV === "production"){
    mongoose.Promise = Promise;
    mongoose.connect( process.env.MONGO_ATLAS_NGSAMPLER_URI);
    mongoose.connection.on('error',(error:Error)=> console.log(error));
}

app.use(express.static(path.join(__dirname, 'build')));

app.use('/', router());

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(4000, ()=>{
    console.log('Typescript Server running on http://localhost:4000/')
})