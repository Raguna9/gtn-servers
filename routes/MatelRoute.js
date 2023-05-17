import express from "express";
import {
    getMatels,
    getMatelById,
    createMatel,
    updateMatel,
    deleteMatel,
    getMatelCount,
    getMatelDetails,
    getMatelDetailsPublic
} from "../controllers/Matels.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";


const router = express.Router();

router.get('/matels', getMatels);
router.get('/carimatels', getMatelDetailsPublic);
router.get('/matelss', verifyUser, getMatelDetails);
router.get('/matels/count', getMatelCount);
router.get('/matels/:id', getMatelById);
router.post('/matels', verifyUser, adminOnly, createMatel);
router.patch('/matels/:id', verifyUser, adminOnly, updateMatel);
router.delete('/matels/:id', verifyUser, adminOnly, deleteMatel);

export default router;