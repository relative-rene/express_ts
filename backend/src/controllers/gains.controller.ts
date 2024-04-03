import express from 'express';
import {
    postExercise,
    getAllExercises
} from './../models/gains.model';

export const readAllExercises = async (req: express.Request, res: express.Response) => {
    try {
        const exercises = await getAllExercises();
        return res.status(200).json(exercises);
    } catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
}

export const createExercise = async (req: express.Request, res: express.Response) => {
    
    try {
        const exercise = await postExercise(req.body);
        return res.status(200).json(exercise);
    } catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
}