import { workReportCache } from './../middlewares/index';
import express from 'express';
import {
    getAllProfiles,
    postProfileStats,
    getAllProfileStats,
    getAProfileStatById,
    patchAProfileStatById,
    postProfileSet,
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
        console.log(error)
        return res.status(400).send({ status: 400, message: "Request timed out please try again" })
    }
}

/**
 * profileStats collection
 */
export const addProfileStats = async (req: express.Request, res: express.Response) => {
    try {
        const { profile_id } = req.params;
        const { date, weight } = req.body;
        if (date && weight) {
            const newStats = Object.assign({}, {
                ...req.body,
                profile_id
            });
            await postProfileStats(newStats);
            let url = workReportCache.data && Object.keys(workReportCache.data).find(key => key.includes('read_stats'));
            url && workReportCache.del(url)
            return res.status(200).json(newStats);
        } else {
            return res.status(422).send({ status: 422, message: `Missing required inputs. Please add date and weight` })
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send({ status: 400, message: 'OOps' })
    }
}

export const readAllProfileStats = async (req: express.Request, res: express.Response) => {
    try {
        const key = req.originalUrl;
        const { profile_id } = req.params;

        const stats = await getAllProfileStats(profile_id);
        workReportCache.set(key, stats, 2592000);
        return res.status(200).json(stats)
    } catch (error) {
        console.log(error)
        return res.status(400).send({ status: 400, message: 'Request timeout, please try again' });
    }
}

export const readAProfileStat = async (req: express.Request, res: express.Response) => {
    try {
        const { profile_id, profile_stat_id } = req.params;
        const stats = await getAProfileStatById(profile_id, profile_stat_id);
        return res.status(200).json(stats)
    } catch (error) {
        console.log(error)
        return res.status(400).send({ status: 400, message: 'Request Failed Please try again later' })
    }
}

export const updateAProfileStat = async (req: express.Request, res: express.Response) => {
    try {
        const { profile_id, stat_id } = req.params;
        const { date, age, weight, body_fat, height, neck, chest, belly, butt, left_arm, right_arm,
            left_forearm, right_forearm, left_leg, right_leg } = req.body;
        if (!date || !weight || !body_fat) return res.status(422).send({ status: 422, message: `Missing required inputs date:${date} weight:${weight} body fat:${body_fat}` });
        const newStat = Object.assign({}, {
            date: date || null,
            age: age || null,
            weight: weight || null,
            body_fat: body_fat || null,
            height: height || null,
            neck: neck || null,
            chest: chest || null,
            belly: belly || null,
            butt: butt || null,
            left_arm: left_arm || null,
            right_arm: right_arm || null,
            left_forearm: left_forearm || null,
            right_forearm: right_forearm || null,
            left_leg: left_leg || null,
            right_leg: right_leg || null
        });

        const stats = await patchAProfileStatById(profile_id, stat_id, newStat);
        let url = workReportCache.data && Object.keys(workReportCache.data).find(key => key.includes('read_stats'));
        url && workReportCache.del(url);
        return res.status(200).json(stats)
    } catch (error) {
        console.log(error)
        return res.status(400).send({ status: 400, message: "Update Request Failed, please fill in form and try again" });
    }
}

/**
 * setLogs collection
 */
export const addProfileSet = async (req: express.Request, res: express.Response) => {
    try {
        const { selectedExercise, set_weight, total_reps, date_and_time, left_reps, right_reps } = req.body;
        const { profile_id } = req.params;
        const weight = set_weight || 0;
        const hasRequiredInputs = date_and_time && selectedExercise && profile_id;
        const hasRequiredReps = total_reps || left_reps && right_reps;
        if (hasRequiredInputs && hasRequiredReps) {
            const [exercise_name, exercise_id] = selectedExercise.split(":")
            const newPR = await postProfileSet(Object.assign({}, {
                date_and_time,
                exercise_id,
                profile_id,
                total_reps: total_reps ? +total_reps : 0,
                left_reps: left_reps ? +left_reps : 0,
                right_reps: right_reps ? +right_reps : 0,
                set_weight: weight,
                exercise_name,
            }
            ));

            let url = workReportCache.data && Object.keys(workReportCache.data).find(key => key.includes('read_sets'));
            console.log('url', url)
            url && workReportCache.del(url);
            return res.status(200).json(newPR);
        } else {
            res.status(422).send({ status: 422, message: 'Missing Inputs. Please fill in form' })
        }
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const readAllProfileSets = async (req: express.Request, res: express.Response) => {
    try {
        const { profile_id } = req.params;
        const key = req.originalUrl;
        const sets = await getAllProfileSets(profile_id);
        workReportCache.set(key, sets, 2592000);

        return res.status(200).json(sets)
    } catch (error) {
        console.log(error)
        return res.status(400).send({ status: 400, message: 'Request Timeout, please try again' });
    }
}

export const removeAProfileSet = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const setLog = await deleteAProfileSet(id);
        let url = workReportCache.data && Object.keys(workReportCache.data).find(key => key.includes('read_sets'));
        url && workReportCache.del(url)
        return res.status(200).json(setLog)
    } catch (error) {
        console.log(error)
        return res.sendStatus(400)
    }
}

export const updateAProfileSet = async (req: express.Request, res: express.Response) => {
    try {
        const { profile_id, set_id } = req.params;
        const { date_and_time, total_reps, left_reps, right_reps, set_weight, selectedExercise } = req.body;
        const [exercise_name, exercise_id] = selectedExercise.split(":")
        if (!date_and_time || !exercise_name) return res.status(422).send({ status: 422, message: `Missing required inputs. Please fill in form` });
        const newSet = Object.assign({}, {
            date_and_time: date_and_time || null,
            exercise_id: exercise_id || null,
            total_reps: +total_reps || null,
            left_reps: +left_reps || null,
            right_reps: +right_reps || null,
            set_weight: +set_weight || null,
            exercise_name: exercise_name || null
        });

        const sets = await patchAProfileSet(profile_id, set_id, newSet);
        let url = workReportCache.data && Object.keys(workReportCache.data).find(key => key.includes('read_sets'));
        url && workReportCache.del(url)
        return res.status(200).json(sets)
    } catch (error) {
        console.log(error)
        return res.status(400).send({ status: 400, message: 'Request Failed. Please fill in required input and try again' });
    }
}