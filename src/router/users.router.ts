import express from 'express';
import { getAllUsers, deleteUser, updateUser, } from '../controllers/users.controller';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    // router.get('/api/users', getAllUsers);
    // router.delete('/api/users/:id', isAuthenticated, isOwner, deleteUser)
    // router.patch('/api/users/:id', isAuthenticated, isOwner, updateUser)
    // router.get('/api/profiles/read', getAllUsers);
    // router.post('/profiles/create', postUser);
    // router.get('/profiles/read/:profile_id' , deleteUser);
    // router.get('/profiles/:profile_id/exercises' , deleteUser);
    // router.put('/profiles/update/:profile_id' , deleteUser);
    // router.delete('/profiles/delete/:profile_id' , deleteUser);

}