import { createConnection, Schema } from 'mongoose';
import 'dotenv/config'

const samplerConn = createConnection(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });



const todosSchema = new Schema({
    profile_id: String,
    description: String,
    is_done: Boolean,
    due_date_and_time: Date,
    creation_date: Date
}, { collection: 'todos' });


export const TodoModel = samplerConn.model('Todos', todosSchema);

export const postTodo = (values: Record<string, any>) => TodoModel.create(values);
export const getProfileTodos = (id:String) => TodoModel.find({ profile_id: id });
export const removeTodo = (profile_id: String, todo_id:String) => TodoModel.findOneAndRemove({ _id: todo_id,profile_id });

export const patchTodo = (values: Record<string, any>) => TodoModel.updateOne({ _id: values._id,profile_id:values.profile_id }, values);