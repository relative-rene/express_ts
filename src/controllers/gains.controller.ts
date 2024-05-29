import express from 'express';
import {
    postExercise,
    getAllExercises,
    patchAnExerciseById
} from '../models/gains.model';
import { Exercise } from '../annotations/gains.type';
import { workReportCache } from '../middlewares/index';

export const readAllExercises = async (req: express.Request, res: express.Response) => {
    try {
        const key = req.originalUrl;
        const exercises = await getAllExercises();
        const sortedExercises = exercises.sort((a: Exercise, b: Exercise) => a.name < b.name ? -1 : 1);
        workReportCache.set(key, sortedExercises, 2592000)
        return res.status(200).json(sortedExercises);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ status: 400, message: error });
    }
}

export const createExercise = async (req: express.Request, res: express.Response) => {
    try {
        const { name, primary_muscle, balance, muscle_group} =req.body
        if(!(name && primary_muscle && balance && muscle_group)) return res.status(422).send({status:422, message:'Missing required input. Please fill in form.'})
        const exercise = await postExercise(req.body);
        workReportCache.del('/api/gains/exercises');
        return res.status(200).json(exercise);
    } catch (error) {
        console.error(error);
        return res.status(400).send({ status: 400, message: 'Request Failed Please try again' });
    }
}

export const updateExercise = async (req: express.Request, res: express.Response) => {
    try {
        const { exercise_id } = req.params;
        const { name, primary_muscle, balance, muscle_group } = req.body;

        if (exercise_id !== req.body._id) return res.status(400).send({ message: 'Exercise Id not found' });
        if(!(name && primary_muscle && balance && muscle_group)) return res.status(422).send({message: 'Missing required inputs'});
        const updatedExercise = Object.assign({}, {
            name,
            primary_muscle,
            balance,
            muscle_group
        });

        const payload = await patchAnExerciseById(exercise_id, updatedExercise);
        workReportCache.del('/api/gains/exercises');
        return res.status(200).json(payload);
    } catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
}