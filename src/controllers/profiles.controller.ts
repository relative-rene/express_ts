import express from 'express';
import {
    postProfile,
    getAllProfiles,
    getAllProfileEmails,

    postProfileStats,
    getAllProfileStats,
    getAProfileStatById,
    patchAProfileStatById,
    deleteAProfileStatById,

    postSetLog,
    getAllProfileSets,
    deleteAProfileSet,
    patchAProfileSet,
} from '../models/gains.model';

/**
 * profiles collection
 */

export const readAllProfiles = async (req: express.Request, res: express.Response) => {
    try {
        const profiles = await getAllProfiles();

        return res.status(200).json(profiles);
    } catch (error) {
        console.error(error);
        return res.sendStatus(400)
    }
}

export const addProfile = async (req: express.Request, res: express.Response) => {
    try {
        const { first_name, last_name, date_of_birth, email, password } = req.body;

        if (email && password) {
            const existingEmails = await getAllProfileEmails();
            const isAvailable = existingEmails.every((vm: Record<string, any>) => email !== vm.email);
            if (isAvailable) {
                const newProfile = await postProfile(Object.assign({}, {
                    first_name,
                    last_name,
                    date_of_birth,
                    email,
                    password
                }
                ))
                return res.status(200).json(newProfile);
            } else {
                return res.status(409).json('Email unavailable')
            }
        } else {
            const missingInput = 'first_name: ' + first_name + ' last_name: ' + last_name + ' date_of_birth: ' + date_of_birth + ' email: ' + email + ' password ' + password;
            console.error(missingInput);
            res.status(422).send(missingInput)
        }
    } catch (error) {
        console.error(error);
        return res.sendStatus(400)
    }
}

export const readAllProfileEmail = async (req: express.Request, res: express.Response) => {
    try {
    } catch (error) {

    }
}


/**
 * profileStats collection
 */
export const addProfileStats = async (req: express.Request, res: express.Response) => {
    try {
        const { profile_id } = req.params;
        const {  chest, abs, thigh, tricep, suprailiac, weight, height, age } = req.body
        if (((chest && abs && thigh) || (tricep && suprailiac && thigh) )&& weight) {
            const newStats = {
                profile_id,
                weight,
                height,
                age,
                chest,
                abs,
                thigh,
                tricep,
                suprailiac
            };
            await postProfileStats(newStats);
            return res.status(200).json(newStats);
        } else {
            return res.status(422).send('Data Incomplete')
        }
    } catch (error) {
        console.error(error);
        return res.status(400).send('OOps')
    }
}

export const readAllProfileStats = async (req: express.Request, res: express.Response) => {
    try {
        const { profile_id } = req.params;
        const data = await getAllProfileStats(profile_id);
        return res.status(200).json(data)
    } catch (error) {
        console.error(error);
        return res.status(400).send('Oops')
    }
}

export const readAProfileStat = async (req: express.Request, res: express.Response) => {
    try {
        const { profile_id, profile_stat_id } = req.params;
        const stats = await getAProfileStatById(profile_id, profile_stat_id);
        return res.status(200).json(stats)
    } catch (error) {
        console.error(error);
        return res.status(400).send('Oops')
    }
}

/**
 * setLogs collection
 */
export const addProfileSet = async (req: express.Request, res: express.Response) => {
    try {
        const { selectedExercise, set_weight, total_reps, date_and_time, left_reps, right_reps } = req.body;
        const { profile_id } = req.params;
        if ((selectedExercise && set_weight && profile_id) && (total_reps || left_reps && right_reps)) {
            const [exercise_name, exercise_id] = selectedExercise.split(":")
            const newPR = await postSetLog(Object.assign({}, {
                exercise_id,
                profile_id,
                exercise_name,
                date_and_time,
                set_weight,
                left_reps,
                right_reps,
                total_reps
            }
            ))
            return res.status(200).json(newPR);
        } else {
            const missingInput = 'profile_id: ' + profile_id + ' selectedExercise: ' + selectedExercise + ' set_weight: ' + set_weight + ' total_reps: ' + total_reps + ' date_and_time ' + date_and_time;
            console.error(missingInput);
            res.status(422).send(missingInput)
        }
    } catch (error) {
        console.error(error);
        return res.sendStatus(400)
    }
}

export const readAllProfileSets = async (req: express.Request, res: express.Response) => {
    try {
        const { profile_id } = req.params;
        const stats = await getAllProfileSets(profile_id);
        return res.status(200).json(stats)
    } catch (error) {
        console.error(error);
        return res.status(400).send('Oops')
    }
}

export const removeAProfileSet = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const setLog = await deleteAProfileSet(id);

        return res.status(200).json(setLog)
    } catch (error) {
        console.error(error);
        return res.sendStatus(400)
    }
}
