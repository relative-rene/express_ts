import express from 'express';
import {
    getANovel,
    createNovel,
    getAllNovels,
    updateNovel,
    deleteNovel,
    getAChapter,
    updateChapter,
    getAllChapters,
    getTableOfContent,
} from '../controllers/acg.controller';

/**
 * The order of these routes is important, if request are triggering the wrong 
 * controllers reviews order the most specific first or make more distinct routes
*/
export default (router: express.Router) => {
    router.post('/api/acg/novels/create', createNovel);
    router.get('/api/acg/novels', getAllNovels)
    router.get('/api/acg/novels/:novel_id', getANovel)
    router.put('/api/acg/novels/update/:novel_id', updateNovel)
    router.delete('/api/acg/novels/delete/:novel_id', deleteNovel)

    router.get('/api/acg/:novel_id', getAllChapters)
    router.get('/api/acg/:novel_id/table', getTableOfContent)
    router.get('/api/acg/:novel_id/:description', getAChapter)
    router.put('/api/acg/chapters/updateOne', updateChapter)
}