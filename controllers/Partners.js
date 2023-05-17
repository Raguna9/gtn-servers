import Partner from "../models/PartnerModel.js";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";

export const getPartners = async (req, res) => {
    try {
        const response = await Partner.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getPartnerCount = async (req, res) => {
    try {
        const count = await Partner.count();
        return res.status(200).json({ count });
    } catch (error) {
        return res.status(500).json({ msg: "Terjadi kesalahan saat mengambil jumlah data" });
    }
};

export const getPartnerById = async (req, res) => {
    try {
        const response = await Partner.findOne({
            where: {
                uuid: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createPartner = async (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
    const name = req.body.name;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const date = new Date();
    const fileName = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}${file.md5}` + ext;
    const urlImage = `${req.protocol}://${req.get("host")}/images/partners/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg', `.svg`, `.jfif`];


    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

    file.mv(`./public/images/partners/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await Partner.create({ name: name, image: fileName, urlImage: urlImage });
            res.status(201).json({ msg: "Partner Created Successfuly" });
        } catch (error) {
            let message = error.message;
            if (message.includes("Validation error:")) {
                message = message.split("Validation error: ")[1];
            }
            res.status(400).json({ msg: message });
        }
    })
}

export const updatePartner = async (req, res) => {
    const partner = await Partner.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!partner) return res.status(404).json({ msg: "No Data Found" });

    let fileName = "";
    if (req.files === null) {
        fileName = partner.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const date = new Date();
        fileName = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}${file.md5}` + ext;
        const allowedType = ['.png', '.jpg', '.jpeg', `.svg`, `.jfif`];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

        const filepath = `./public/images/partners/${partner.image}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        file.mv(`./public/images/partners/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }
    const name = req.body.name;
    const urlImage = `${req.protocol}://${req.get("host")}/images/partners/${fileName}`;

    try {
        await Partner.update({ name: name, image: fileName, urlImage: urlImage }, {
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Partner Updated Successfuly" });
    } catch (error) {
        let message = error.message;
        if (message.includes("Validation error:")) {
            message = message.split("Validation error: ")[1];
        }
        res.status(400).json({ msg: message });
    }
}

export const deletePartner = async (req, res) => {
    const partner = await Partner.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!partner) return res.status(404).json({ msg: "No Data Found" });

    try {
        const filepath = `./public/images/partners/${partner.image}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        await Partner.destroy({
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Partner Deleted Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
}

export const getPartnerDetails = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const offset = limit * page;
    const totalRows = await Partner.count();
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Partner.findAll({
        offset: offset,
        limit: limit,
        order: [
            ['id', 'DESC']
        ]
    });
    res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage
    });
}