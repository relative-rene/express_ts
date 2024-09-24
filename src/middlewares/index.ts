import express from 'express';
import { get, merge } from 'lodash';
import { getProfileBySessionToken } from '../models/gains.model';
import NodeCache from 'node-cache';

export const workReportCache = new NodeCache();
export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['RENE-AUTH'];

        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const existingUser = await getProfileBySessionToken(sessionToken);

        if (!existingUser) {
            return res.sendStatus(403);
        }
        merge(req, { identity: existingUser });
        return next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(400)
    }
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if (!currentUserId) {
            return res.sendStatus(403);
        }
        if (currentUserId.toString() !== id) {
            return res.sendStatus(403);
        }
    } catch (error) {
        console.error(error);
        return res.sendStatus(400)
    }
}


// export const confirmationEmail = () => {
//     let transporter =
//         nodemailer.createTransport({
//             host: 'smtp.example.com',
//             port: 587,
//             secure: false, // true for 465, false for all others
//             auth: {
//                 user: 'account@example.com',
//                 // your smtp username
//                 pass: 'password'
//             }
//         });
//     const sendConfirmation = (to: string, name: string, token: string) => {
//         let mailOptions = {
//             from: '"Your Company Name"<no-reply@example.com>',// sender address
//             to: to, // list of receivers,
//             subject: 'Account Confirmation',
//             text: `Hello ${name},\n\nPlease confirm your account by clicking the link below:\n\nhttp://yourdomain.com/confirmation/${token}\n\nThank You!`,// plain text
//             html: `<b>Hello ${name}</b> <br />Please confirm your account by clicking the link below:<br><a href="http://yourdomain.com/confirmation/${token}>Confirm Account</a><br><br>Thank You!`
//         }
//         transporter.sendMail(mailOptions, (error: Error, info: any) => {
//             if (error) {
//                 return console.log(error);
//             }
//             console.log('Message sent:%s', info.messageId);
//         });
//     }
// }

// Middleware to check cache before processing a request
export function cacheMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const key = req.originalUrl;
    const cachedResponse = workReportCache.get(key);
    console.log('key', key, 'cachedResponse', cachedResponse)
    if (cachedResponse) {
        res.send(cachedResponse);
    } else {
        next();
    }
}


