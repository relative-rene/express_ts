import express from 'express';
import authentication from './authentication.router';
import users from './users.router';
import acg from './acg.router';
import gains from './gains.router';
import profiles from './profiles.router';
import todos from './todos.router';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    users(router);
    acg(router);
    gains(router);
    profiles(router);
    todos(router);
    // cat(router)
    return router;
}