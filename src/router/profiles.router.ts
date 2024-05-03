import {
    readAllProfiles,
    addProfileSet,
    addProfile,
    readAllProfileSets,
    removeAProfileSet,
    addProfileStats,
    readAProfileStat,
    readAllProfileStats
} from '../controllers/profiles.controller';
import express from 'express';

export default (router: express.Router) => {
    // profiles
    router.get('/api/profiles/read', readAllProfiles);
    router.post('/api/profile/create', addProfile);

    // profileStats
    router.post('/api/profiles/:profile_id/stats/create', addProfileStats);
    router.get('/api/profiles/:profile_id/stats/read', readAProfileStat);
    router.get('/api/profiles/:profile_id/all_stats/read', readAllProfileStats);
    // router.put('/api/profiles/:profile_id/stats/patch', updateAProfileStat);
    // router.delete('/api/profiles/:profile_id/stats/delete', removeAProfileStat);

    // setLogs
    router.post('/api/profiles/:profile_id/set/create', addProfileSet);
    router.get('/api/profiles/:profile_id/all_sets/read', readAllProfileSets);
    
    router.put('/api/profiles/:profile_id/set/patch', addProfileSet);
    router.delete('/api/profiles/:profile_id/set/delete', removeAProfileSet);
    // router.get('/api/profiles/:profile_id/set/read', addProfileSet);
    
}
