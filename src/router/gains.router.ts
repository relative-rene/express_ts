import express from 'express';
import { readAllExercises, createExercise } from '../controllers/gains.controller';

export default (router: express.Router) => {
    router.post('/api/gains/exercises/create', createExercise);
    router.get('/api/gains/exercises', readAllExercises);

    // router.get('/api/gains/exercises/:exercise_id' , deleteUser);
    // router.put('/exercises/update/:exercise_id' , deleteUser);
    // router.delete('/exercises/delete/:exercise_id' , deleteUser);

    // router.get('/exerciselogs/read' getAllUsers);
    // router.post('/profiles/:profile_id/create/exerciselogs' , deleteUser);
    // router.get('/profile/:profile_id/exerciselogs/:exerciselog_id' , deleteUser);
    // router.put('/profile/:profile_id/exerciselogs/:exerciselog_id' , deleteUser);
    // router.delete('/profile/:profile_id/exerciselogs/:exerciselog_id' , deleteUser);

}
