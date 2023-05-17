import Gallery from "../models/GalleryModel.js";
import path from "path";
import fs from "fs";

export const getGallerys = async (req, res) => {
    try {
        const response = await Gallery.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getGalleryCount = async (req, res) => {
    try {
        const count = await Gallery.count();
        return res.status(200).json({ count });
    } catch (error) {
        return res.status(500).json({ msg: "Terjadi kesalahan saat mengambil jumlah data" });
    }
};

export const getGalleryById = async (req, res) => {
    try {
        const response = await Gallery.findOne({
            where: {
                uuid: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createGallery = async (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
    const description = req.body.description;

    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const date = new Date();
    const fileName = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}${file.md5}` + ext;
    const urlImage = `${req.protocol}://${req.get("host")}/images/gallerys/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];


    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

    file.mv(`./public/images/gallerys/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await Gallery.create({ image: fileName, urlImage: urlImage, description: description });
            res.status(201).json({ msg: "Gallery Created Successfuly" });
        } catch (error) {
            let message = error.message;
            if (message.includes("Validation error:")) {
                message = message.split("Validation error: ")[1];
            }
            res.status(400).json({ msg: message });
        }
    })
}

export const updateGallery = async (req, res) => {
    const gallery = await Gallery.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!gallery) return res.status(404).json({ msg: "No Data Found" });

    let fileName = "";
    if (req.files === null) {
        fileName = gallery.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const date = new Date();
        fileName = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}${file.md5}` + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

        const filepath = `./public/images/gallerys/${gallery.image}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        file.mv(`./public/images/gallerys/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }
    const description = req.body.description;
    const urlImage = `${req.protocol}://${req.get("host")}/images/gallerys/${fileName}`;

    try {
        await Gallery.update({ image: fileName, urlImage: urlImage, description: description }, {
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Gallery Updated Successfuly" });
    } catch (error) {
        let message = error.message;
        if (message.includes("Validation error:")) {
            message = message.split("Validation error: ")[1];
        }
        res.status(400).json({ msg: message });
    }
}

export const deleteGallery = async (req, res) => {
    const gallery = await Gallery.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!gallery) return res.status(404).json({ msg: "No Data Found" });

    try {
        const filepath = `./public/images/gallerys/${gallery.image}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        await Gallery.destroy({
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Gallery Deleted Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
}