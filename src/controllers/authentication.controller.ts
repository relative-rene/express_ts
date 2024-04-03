import { postProfile, getProfileByEmail } from '../models/gains.model';
import { authentication, random } from '../helper/index';
import express from 'express';
import 'dotenv/config'

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        if (!email || !password) {
            return res.sendStatus(400)
        }
        const user = await getProfileByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.sendStatus(400);
        }
        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(403)
        }
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString())
        await user.save();

        console.log(user.authentication.sessionToken);

       res.cookie('[RENE-AUTH]', user.authentication.sessionToken, {
        // httpOnly: true, The cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production', // Use secure in production
        sameSite: 'strict', // The cookie is sent only to requests originating from the same site
        expires: new Date(Date.now() + 36000000) // The cookie will expire in 1 hour
      });
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
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
            email,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })
        return res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}