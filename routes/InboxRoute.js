import express from "express";
import {
    getInboxs,
    getInboxById,
    createInbox,
    // updateInbox,
    deleteInbox,
    getInboxCount
} from "../controllers/Inboxs.js";


const router = express.Router();

router.get('/inboxs', getInboxs);
router.get('/inboxs/count', getInboxCount);
router.get('/inboxs/:id', getInboxById);
router.post('/inboxs', createInbox);
// router.patch('/inboxs/:id', updateInbox);
router.delete('/inboxs/:id', deleteInbox);

export default router;