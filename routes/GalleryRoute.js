import express from "express";
import {
    getGallerys,
    getGalleryById,
    createGallery,
    updateGallery,
    deleteGallery,
    getGalleryCount
} from "../controllers/Gallerys.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";


const router = express.Router();

router.get('/gallerys', getGallerys);
router.get('/gallerys/count', getGalleryCount);
router.get('/gallerys/:id', getGalleryById);
router.post('/gallerys', verifyUser, adminOnly, createGallery);
router.patch('/gallerys/:id', verifyUser, adminOnly, updateGallery);
router.delete('/gallerys/:id', verifyUser, adminOnly, deleteGallery);

// router.get('/listgallerys', getListGallerys);
// router.get('/listgallerys/:id', getListGalleryById);

export default router;