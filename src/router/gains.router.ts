import express from 'express';
import {
    readAllExercises,
    createExercise,
    updateExercise
} from '../controllers/gains.controller';

export default (router: express.Router) => {
    router.post('/api/gains/exercises/create_exercise', createExercise);
    router.put('/api/gains/exercises/:exercise_id/update_exercise', updateExercise);
    router.get('/api/gains/exercises', readAllExercises);
    // router.get('/api/gains/exercises/:exercise_id' , deleteUser);
    // router.delete('/api/gains/exercises/delete/:exercise_id' , deleteUser);

}
