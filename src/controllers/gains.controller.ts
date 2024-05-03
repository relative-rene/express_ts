import express from 'express';
import {
    postExercise,
    getAllExercises
} from '../models/gains.model';
import { Exercise } from '../annotations/gains.type';


export const readAllExercises = async (req: express.Request, res: express.Response) => {
    try {
        const exercises = await getAllExercises()
        const sortedExercises = exercises.sort((a: Exercise, b: Exercise) => a.name < b.name ? -1 : 1);
        return res.status(200).json(sortedExercises);
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