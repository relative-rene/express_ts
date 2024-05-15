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
        console.error(error);
        return res.sendStatus(400)
    }
}

/**
 * profileStats collection
 */
export const addProfileStats = async (req: express.Request, res: express.Response) => {
    try {
        const { profile_id } = req.params;
        const { date, age, weight } = req.body;
        if (date && age && weight) {
            const newStats = Object.assign({}, {
                ...req.body,
                profile_id,
                date,
                age,
                weight
            });
            await postProfileStats(newStats);
            let url = workReportCache.data && Object.keys(workReportCache.data).find(key => key.includes('read_stats'));
            workReportCache.del(url)
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
        const key = req.originalUrl;
        const { profile_id } = req.params;

        const stats = await getAllProfileStats(profile_id);
        workReportCache.set(key, stats, 2592000);

        return res.status(200).json(stats)
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

export const updateAProfileStat = async (req: express.Request, res: express.Response) => {
    try {
        const { profile_id, stat_id } = req.params;
        const { date, age, weight, body_fat, height, neck, chest, belly, butt, left_arm, right_arm,
            left_forearm, right_forearm, left_leg, right_leg } = req.body;
        if (!date || !weight || !body_fat) return res.status(422).send('Missing required inputs');
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
        workReportCache.del(url)
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
            const newPR = await postProfileSet(Object.assign({}, {
                date_and_time,
                exercise_id,
                profile_id,
                total_reps: total_reps ? +total_reps : 0,
                left_reps: left_reps ? +left_reps : 0,
                right_reps: right_reps ? +right_reps : 0,
                set_weight: set_weight ? +set_weight : 0,
                exercise_name,
            }
            ));

            let url = workReportCache.data && Object.keys(workReportCache.data).find(key => key.includes('read_sets'));
            workReportCache.del(url);
            return res.status(200).json(newPR);
        } else {
            const missingInput = 'profile_id: ' + profile_id + ' selectedExercise: ' + selectedExercise + ' set_weight: ' + set_weight + ' total_reps: ' + total_reps + ' date_and_time ' + date_and_time;
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
        const key = req.originalUrl;
        const sets = await getAllProfileSets(profile_id);
        workReportCache.set(key, sets, 2592000);

        return res.status(200).json(sets)
    } catch (error) {
        console.error(error);
        return res.status(400).send('Oops')
    }
}

export const removeAProfileSet = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const setLog = await deleteAProfileSet(id);
        let url = workReportCache.data && Object.keys(workReportCache.data).find(key => key.includes('read_sets'));
        workReportCache.del(url)
        return res.status(200).json(setLog)
    } catch (error) {
        console.error(error);
        return res.sendStatus(400)
    }
}

export const updateAProfileSet = async (req: express.Request, res: express.Response) => {
    try {
        const { profile_id, set_id } = req.params;
        const { date_and_time, exercise_id, total_reps, left_reps, right_reps, set_weight, exercise_name } = req.body;
        if (!date_and_time || !exercise_name) return res.status(422).send('Missing required inputs');
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
        workReportCache.del(url)
        return res.status(200).json(sets)
    } catch (error) {
        console.error(error);
        return res.status(400).send('Oops')
    }
}