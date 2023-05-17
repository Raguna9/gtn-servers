import Matel from "../models/MatelModel.js";
import { Op } from "sequelize";

export const getMatels = async (req, res) => {
    try {
        const response = await Matel.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getMatelCount = async (req, res) => {
    try {
        const count = await Matel.count();
        return res.status(200).json({ count });
    } catch (error) {
        return res.status(500).json({ msg: "Terjadi kesalahan saat mengambil jumlah data" });
    }
};

export const getMatelById = async (req, res) => {
    try {
        const response = await Matel.findOne({
            where: {
                uuid: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createMatel = async (req, res) => {
    const { name, nopol, nosin, noka, merkType, overdue, finance, kontrak } = req.body;
    try {
        await Matel.create({
            name: name,
            nopol: nopol,
            nosin: nosin,
            noka: noka,
            merkType: merkType,
            overdue: overdue,
            finance: finance,
            kontrak: kontrak
        });
        res.status(201).json({ msg: "Matel Berhasil Ditambahkan" });
    } catch (error) {
        let message = error.message;
        if (message.includes("Validation error:")) {
            message = message.split("Validation error: ")[1];
        }
        res.status(400).json({ msg: message });
    }
}

export const updateMatel = async (req, res) => {
    const matel = await Matel.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!matel) return res.status(404).json({ msg: "Matel tidak ditemukan" });
    const { name, nopol, nosin, noka, merkType, overdue, finance, kontrak } = req.body;
    try {
        await Matel.update({
            name: name,
            nopol: nopol,
            nosin: nosin,
            noka: noka,
            merkType: merkType,
            overdue: overdue,
            finance: finance,
            kontrak: kontrak
        }, {
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Matel updated successfuly" });
    } catch (error) {
        let message = error.message;
        if (message.includes("Validation error:")) {
            message = message.split("Validation error: ")[1];
        }
        res.status(400).json({ msg: message });
    }
}

export const deleteMatel = async (req, res) => {
    const matel = await Matel.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!matel) return res.status(404).json({ msg: "No Data Found" });
    try {
        await Matel.destroy({
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Matel deleted successfuly" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getMatelDetails = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const totalRows = await Matel.count({
        where: {
            [Op.or]: [{
                name: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                nopol: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                nosin: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                noka: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                kontrak: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                finance: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        }
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Matel.findAll({
        where: {
            [Op.or]: [{
                name: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                nopol: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                nosin: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                noka: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                kontrak: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                finance: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        },
        offset: offset,
        limit: limit,
        order: [
            ['overdue', 'DESC']
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

//untuk pencarian public
export const getMatelDetailsPublic = async (req, res) => {
    const search = req.query.search_query || "notnull";

    const result = await Matel.findAll({
        where: {
            [Op.or]: [{
                nopol: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                nosin: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                noka: {
                    [Op.like]: '%' + search + '%'
                }
            }, {
                kontrak: {
                    [Op.like]: '%' + search + '%'
                }
            }]
        }
    });
    res.json({
        result: result
    });
}
