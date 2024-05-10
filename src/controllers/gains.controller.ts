import express from 'express';
import {
    postExercise,
    getAllExercises,
    patchAnExerciseById
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

export const updateExercise = async (req: express.Request, res: express.Response) => {
    try {
        const { exercise_id } = req.params;
        const { name, primary_muscle, balance, muscle_group } = req.body;

        console.log('exercise_id', exercise_id,  name, primary_muscle, balance, muscle_group )

        if (exercise_id !== req.body._id) {
            return res.status(400).send('Exercise Id not found');
        }
        const updatedExercise = Object.assign({}, {
            name,
            primary_muscle,
            balance,
            muscle_group
        });

        const payload = await patchAnExerciseById(exercise_id, updatedExercise);
        return res.status(200).json(payload);
    } catch (error) {
        console.error('catch', error);
        return res.sendStatus(400);
    }
}