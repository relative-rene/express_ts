import express from 'express';
import {
    postTodo,
    getProfileTodos,
    removeTodo,
    patchTodo
} from '../models/todos.model';


export const createTodo = async (req: express.Request, res: express.Response) => {
    try {
        const { description, isDone, dueDateAndTime } = req.body;
        const { profile_id } = req.params;

        if (description && !isDone && dueDateAndTime) {
            const todo = await postTodo({ description, is_done: isDone, due_date_and_time: dueDateAndTime, profile_id, creation_date: new Date() })
            return res.status(200).json(todo);
        } else {
            return res.status(422).send('Todo missing data')
        }
    } catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
}

export const readAllProfileTodos = async (req: express.Request, res: express.Response) => {
    try {
        const { profile_id } = req.params;
        const todos = await getProfileTodos(profile_id);
        return res.status(200).json(todos);
    } catch (error) {
        console.error(error);
        return res.status(400)
    }
}

export const deleteTodo = async (req: express.Request, res: express.Response) => {
    try {
        const { profile_id, todo_id } = req.params;
        const deletedNovel = await removeTodo(profile_id, todo_id);

        return res.json(deletedNovel)
    } catch (error) {
        console.error(error);
        return res.sendStatus(400)
    }
}

export const updateTodo = async (req: express.Request, res: express.Response) => {
    try {
        const { todo_id, profile_id } = req.params;
        const { description, due_date_and_time, is_done, creation_date } = req.body[0];

        console.log(req.params, req.body);
        if (profile_id !== req.body[0].profile_id || todo_id !== req.body[0]._id) {
            console.log(description, due_date_and_time, is_done, creation_date)
            return res.sendStatus(400)
        }
        const updatedTodo = Object.assign({}, {
            description,
            due_date_and_time,
            is_done,
            _id: todo_id,
            profile_id,
            creation_date
        });
        const todo = await patchTodo(updatedTodo);
        return res.status(200).json(todo);
    } catch (error) {
        console.error('catch', error);
        return res.sendStatus(400);
    }
}