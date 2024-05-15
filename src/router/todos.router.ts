import express from 'express';
import { readAllProfileTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todos.controller';



export default (router: express.Router) => {
    router.post('/api/profiles/:profile_id/todos/create_todo', createTodo);
    router.get('/api/profiles/:profile_id/todos/read_todos', readAllProfileTodos);
    router.delete('/api/profiles/:profile_id/todos/:todo_id/delete_todo', deleteTodo);
    router.put('/api/profiles/:profile_id/todos/:todo_id/updateOne_todo', updateTodo);
}