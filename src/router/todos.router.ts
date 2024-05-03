import express from 'express';
import { readAllProfileTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todos.controller';



export default (router: express.Router) => {
    router.post('/api/profiles/:profile_id/todo/create', createTodo);
    router.get('/api/profiles/:profile_id/todos/read', readAllProfileTodos);
    router.delete('/api/profiles/:profile_id/todos/:todo_id/delete', deleteTodo);
    router.put('/api/profiles/:profile_id/todos/:todo_id/updateOne', updateTodo);
}