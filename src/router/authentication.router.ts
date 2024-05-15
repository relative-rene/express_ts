import express from 'express';

import { registerClient, registerSuperAdmin, registerAdmin, login } from '../controllers/authentication.controller';

export default (router: express.Router) => {
    router.post('/auth/register_client', registerClient);
    router.post('/auth/register_admin', registerAdmin);
    router.post('/auth/register_super_admin', registerSuperAdmin);
    router.post('/auth/login', login)
}