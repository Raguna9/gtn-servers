import ExternalEmployee from "../models/ExternalEmployeeModel.js";
import path from "path";
import fs from "fs";

export const getExternalEmployees = async (req, res) => {
    try {
        const response = await ExternalEmployee.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getExternalEmployeeCount = async (req, res) => {
    try {
        const count = await ExternalEmployee.count();
        return res.status(200).json({ count });
    } catch (error) {
        return res.status(500).json({ msg: "Terjadi kesalahan saat mengambil jumlah data" });
    }
};

export const getExternalEmployeeById = async (req, res) => {
    try {
        const response = await ExternalEmployee.findOne({
            where: {
                uuid: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createExternalEmployee = async (req, res) => {
    if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
    const name = req.body.name;
    const department = req.body.department;
    const gender = req.body.gender;
    const email = req.body.email;
    const sppi = req.body.sppi;

    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const date = new Date();
    const fileName = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}${file.md5}` + ext;
    const urlImage = `${req.protocol}://${req.get("host")}/images/externalEmployees/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

    file.mv(`./public/images/externalEmployees/${fileName}`, async (err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            await ExternalEmployee.create({ name: name, department: department, gender: gender, email: email, sppi: sppi, image: fileName, urlImage: urlImage });
            res.status(201).json({ msg: "ExternalEmployee Created Successfuly" });
        } catch (error) {
            let message = error.message;
            if (message.includes("Validation error:")) {
                message = message.split("Validation error: ")[1];
            }
            res.status(400).json({ msg: message });
        }
    })
}

export const updateExternalEmployee = async (req, res) => {
    const externalEmployee = await ExternalEmployee.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!externalEmployee) return res.status(404).json({ msg: "No Data Found" });

    let fileName = "";
    if (req.files === null) {
        fileName = externalEmployee.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const date = new Date();
        fileName = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}${file.md5}` + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });


        const filepath = `./public/images/externalEmployees/${externalEmployee.image}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        file.mv(`./public/images/externalEmployees/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }
    const name = req.body.name;
    const department = req.body.department;
    const gender = req.body.gender;
    const email = req.body.email;
    const sppi = req.body.sppi;
    const urlImage = `${req.protocol}://${req.get("host")}/images/externalEmployees/${fileName}`;

    try {
        await ExternalEmployee.update({ name: name, department: department, gender: gender, email: email, sppi: sppi, image: fileName, urlImage: urlImage }, {
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Employee Updated Successfuly" });
    } catch (error) {
        let message = error.message;
        if (message.includes("Validation error:")) {
            message = message.split("Validation error: ")[1];
        }
        res.status(400).json({ msg: message });
    }
}

export const deleteExternalEmployee = async (req, res) => {
    const externalEmployee = await ExternalEmployee.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!externalEmployee) return res.status(404).json({ msg: "No Data Found" });

    try {
        const filepath = `./public/images/externalEmployees/${externalEmployee.image}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        await ExternalEmployee.destroy({
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "ExternalEmployee Deleted Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
}

export const getExternalEmployeeDetails = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await ExternalEmployee.count();
    const totalPage = Math.ceil(totalRows / limit);
    const result = await ExternalEmployee.findAll({
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