import express from 'express';

import { 
    registerClient, 
    registerSuperAdmin, 
    registerAdmin, 
    login, 
    updateClientPassword, 
    confirmClientEmail} from '../controllers/authentication.controller';

export default (router: express.Router) => {
    router.post('/auth/email_client', confirmClientEmail)
    router.post('/auth/register_client', registerClient);
    router.post('/auth/register_admin', registerAdmin);
    router.post('/auth/register_super_admin', registerSuperAdmin);
    router.post('/auth/login', login)
    router.post('/auth/update_client_password', updateClientPassword);
}