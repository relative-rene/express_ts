import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

export const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URI);
        console.log(`MongoDB connectioned: ${conn.connection.host}`);
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}