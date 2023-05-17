import Blog from "../models/BlogModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";

export const getBlogs = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            response = await Blog.findAll({
                attributes: ['uuid', 'tittle', 'content', 'urlImage', 'userId', 'updatedAt'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Blog.findAll({
                attributes: ['uuid', 'tittle', 'content', 'urlImage', 'userId', 'updatedAt'],
                where: {
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getBlogCount = async (req, res) => {
    try {
        const count = await Blog.count();
        return res.status(200).json({ count });
    } catch (error) {
        return res.status(500).json({ msg: "Terjadi kesalahan saat mengambil jumlah data" });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!blog) return res.status(404).json({ msg: "Data tidak ditemukan" });
        let response;
        if (req.role === "admin") {
            response = await Blog.findOne({
                attributes: ['uuid', 'tittle', 'content', 'urlImage', 'userId', 'updatedAt'],
                where: {
                    id: blog.id
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
            response = await Blog.findOne({
                attributes: ['uuid', 'tittle', 'content', 'urlImage', 'userId', 'updatedAt'],
                where: {
                    [Op.and]: [{ id: blog.id }, { userId: req.userId }]
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createBlog = async (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
    const tittle = req.body.tittle;
    const content = req.body.content;

    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const date = new Date();
    const fileName = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}${file.md5}` + ext;
    const urlImage = `${req.protocol}://${req.get("host")}/images/blogs/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

    file.mv(`./public/images/blogs/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await Blog.create({ tittle: tittle, content: content, image: fileName, urlImage: urlImage, userId: req.userId });
            res.status(201).json({ msg: "Blogs Created Successfuly" });
        } catch (error) {
            let message = error.message;
            if (message.includes("Validation error:")) {
                message = message.split("Validation error: ")[1];
            }
            res.status(400).json({ msg: message });
        }
    })
}

export const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!blog) return res.status(404).json({ msg: "Data tidak ditemukan" });

        let fileName = "";
        if (req.files === null) {
            fileName = blog.image;
        } else {
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            const date = new Date();
            fileName = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}${file.md5}` + ext;
            const allowedType = ['.png', '.jpg', '.jpeg'];

            if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
            if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

            const filepath = `./public/images/blogs/${blog.image}`;
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }

            file.mv(`./public/images/blogs/${fileName}`, (err) => {
                if (err) return res.status(500).json({ msg: err.message });
            });
        }
        const tittle = req.body.tittle;
        const content = req.body.content;
        const urlImage = `${req.protocol}://${req.get("host")}/images/blogs/${fileName}`;

        if (req.role === "admin") {
            await Blog.update({ tittle: tittle, content: content, image: fileName, urlImage: urlImage }, {
                where: {
                    id: blog.id
                }
            });
        } else {
            if (req.userId !== blog.userId) return res.status(403).json({ msg: "Akses terlarang" });
            await Blog.update({ tittle: tittle, content: content, image: fileName, urlImage: urlImage }, {
                where: {
                    [Op.and]: [{ id: blog.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Blog updated successfuly" });
    } catch (error) {
        let message = error.message;
        if (message.includes("Validation error:")) {
            message = message.split("Validation error: ")[1];
        }
        res.status(400).json({ msg: message });
    }
}

export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!blog) return res.status(404).json({ msg: "Data tidak ditemukan" });

        if (req.role === "admin") {
            const filepath = `./public/images/blogs/${blog.image}`;
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
            await Blog.destroy({
                where: {
                    id: blog.id
                }
            });
        } else {
            if (req.userId !== blog.userId) return res.status(403).json({ msg: "Akses terlarang" });
            const filepath = `./public/images/blogs/${blog.image}`;
            fs.unlinkSync(filepath);
            await Blog.destroy({
                where: {
                    [Op.and]: [{ id: blog.id }, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({ msg: "Blog deleted successfuly" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


//public
export const getListBlogs = async (req, res) => {
    try {
        let response;
        response = await Blog.findAll({
            attributes: ['id', 'uuid', 'tittle', 'content', 'urlImage', 'userId', 'updatedAt'],
            order: [
                ['id', 'DESC']
            ]
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getListBlogById = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!blog) return res.status(404).json({ msg: "Data tidak ditemukan" });
        let response;
        response = await Blog.findOne({
            attributes: ['id', 'uuid', 'tittle', 'content', 'urlImage', 'userId', 'updatedAt'],
            where: {
                id: blog.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}