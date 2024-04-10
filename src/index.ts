import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from './router';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from '../src/config/connectDB';

process.env.NODE_ENV === 'production'?
  dotenv.config({ path:`.env.${process.env.NODE_ENV}`}):
  dotenv.config();
  
console.log('DATABASE_URI', process.env.DATABASE_URI);
console.log('SERVER_URI', process.env.SERVER_URI);

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

// mongoose.Promise = Promise;
// mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connection.on('error', (error: Error) => console.error(error));
// connectDB()
const { MongoClient, ServerApiVersion } = require('mongodb');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DATABASE_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
app.use(express.static(path.join(__dirname,'public')));

app.use('/', router());

server.listen(process.env.PORT, () => console.log('SERVER_URI', process.env.SERVER_URI));
