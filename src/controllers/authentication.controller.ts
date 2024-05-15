import { postProfile, getProfileByEmail } from '../models/gains.model';
import { authentication, random } from '../helper/index';
import express from 'express';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ status: 400, message: `missing email ${email} or password ${password}` });
        }
        const user = await getProfileByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.status(400).send({ status: 400, message: 'user not found' })
        }
        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return res.status(403).send({ status: 403, message: 'Incorrect login credentials' })
        }
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString())
        await user.save();

        res.cookie('[RENE-AUTH]', user.authentication.sessionToken, {
            // httpOnly: true, The cookie is not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: 'strict', // The cookie is sent only to requests originating from the same site
            expires: new Date(Date.now() + 36000000) // The cookie will expire in 1 hour
        });
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
}

export const registerClient = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, first_name, last_name, date_of_birth, } = req.body;

        if (!email || !password) {
            return res.sendStatus(400)
        }
        const existingUser = await getProfileByEmail(email);
        if (existingUser) {
            return res.status(409).json('Email unavailable')
        }
        const salt = random();
        const user = await postProfile({
            first_name,
            last_name,
            date_of_birth,
            user_access: 1,
            email,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })
        return res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        return res.sendStatus(400).json({ message: error })
    }
}

// TODO think of a way that creating an admin profile requires the approval of superAdmin.
// Folks with admin access should store their _ids in a reference collection;
// This way, when the do something that requires admin access, their access can be verified. 
export const registerAdmin = async (req: express.Request, res: express.Response) => {
    //     try {
    //         const { email, password, first_name, last_name, date_of_birth } = req.body;

    //         if (!email || !password) {
    //             return res.sendStatus(400)
    //         }
    //         const existingUser = await getProfileByEmail(email);
    //         if (existingUser) {
    //             return res.status(409).json('Email unavailable')
    //         }
    //         const salt = random();
    //         const user = await postProfile({
    //             first_name,
    //             last_name,
    //             date_of_birth,
    //             user_access:1,
    //             email,
    //             adminAccess:2,
    //             authentication: {
    //                 salt,
    //                 password: authentication(salt, password)
    //             }
    //         })
    //         return res.status(200).json(user);
    //     }
    //     catch (error) {
    //         console.error(error);
    //         return res.sendStatus(400).json({message:error})
    //     }
}
export const registerSuperAdmin = async (req: express.Request, res: express.Response) => {
    //     try {
    //         const { email, password, first_name, last_name, date_of_birth } = req.body;

    //         if (!email || !password) {
    //             return res.sendStatus(400)
    //         }
    //         const existingUser = await getProfileByEmail(email);
    //         if (existingUser) {
    //             return res.status(409).json('Email unavailable')
    //         }
    //         const salt = random();
    //         const user = await postProfile({
    //             first_name,
    //             last_name,
    //             date_of_birth,
    //             user_access:3,
    //             email,
    //             adminAccess:4,
    //             authentication: {
    //                 salt,
    //                 password: authentication(salt, password)
    //             }
    //         })
    //         return res.status(200).json(user);
    //     }
    //     catch (error) {
    //         console.error(error);
    //         return res.sendStatus(400).json({message:error})
    //     }
}