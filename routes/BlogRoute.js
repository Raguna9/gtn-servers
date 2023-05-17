import express from "express";
import {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    getListBlogs,
    getListBlogById,
    getBlogCount
} from "../controllers/Blogs.js";
import { verifyUser } from "../middleware/AuthUser.js";


const router = express.Router();

router.get('/blogs', verifyUser, getBlogs);
router.get('/blogs/count', getBlogCount);
router.get('/blogs/:id', verifyUser, getBlogById);
router.post('/blogs', verifyUser, createBlog);
router.patch('/blogs/:id', verifyUser, updateBlog);
router.delete('/blogs/:id', verifyUser, deleteBlog);

router.get('/listblogs', getListBlogs);
router.get('/listblogs/:id', getListBlogById);

export default router;