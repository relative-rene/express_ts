import express from 'express';
import {
    addProfileSet,
    readAllProfileSets,
    removeAProfileSet,
    addProfileStats,
    readAProfileStat,
    readAllProfileStats,
    updateAProfileStat,
    updateAProfileSet,
} from '../controllers/profiles.controller';


export default (router: express.Router) => {
    // profileStats
    router.post('/api/profiles/:profile_id/create_stats', addProfileStats);
    router.get('/api/profiles/:profile_id/read_stat', readAProfileStat);
    router.get('/api/profiles/:profile_id/read_stats', readAllProfileStats);
    router.put('/api/profiles/:profile_id/:stat_id/patch_stats', updateAProfileStat);
    // router.delete('/api/profiles/:profile_id/stats/delete', removeAProfileStat);
    
    // setLogs
    router.post('/api/profiles/:profile_id/create_set', addProfileSet);
    router.get('/api/profiles/:profile_id/read_sets', readAllProfileSets);
    router.put('/api/profiles/:profile_id/:set_id/patch_set', updateAProfileSet);
    router.delete('/api/profiles/:profile_id/delete_set', removeAProfileSet);

}
