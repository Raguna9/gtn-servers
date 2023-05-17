import FAQ from "../models/FAQModel.js";

export const getFAQs = async (req, res) => {
    try {
        const response = await FAQ.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getFAQCount = async (req, res) => {
    try {
        const count = await FAQ.count();
        return res.status(200).json({ count });
    } catch (error) {
        return res.status(500).json({ msg: "Terjadi kesalahan saat mengambil jumlah data" });
    }
};

export const getFAQById = async (req, res) => {
    try {
        const response = await FAQ.findOne({
            where: {
                uuid: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createFAQ = async (req, res) => {
    const { question, answer } = req.body;
    try {
        await FAQ.create({
            question: question,
            answer: answer
        });
        res.status(201).json({ msg: "FAQ Berhasil Ditambahkan" });
    } catch (error) {
        let message = error.message;
        if (message.includes("Validation error:")) {
            message = message.split("Validation error: ")[1];
        }
        res.status(400).json({ msg: message });
    }
}

export const updateFAQ = async (req, res) => {
    const faq = await FAQ.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!faq) return res.status(404).json({ msg: "FAQ tidak ditemukan" });
    const { question, answer } = req.body;
    try {
        await FAQ.update({
            question: question,
            answer: answer
        }, {
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "FAQ updated successfuly" });
    } catch (error) {
        let message = error.message;
        if (message.includes("Validation error:")) {
            message = message.split("Validation error: ")[1];
        }
        res.status(400).json({ msg: message });
    }
}

export const deleteFAQ = async (req, res) => {
    const faq = await FAQ.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!faq) return res.status(404).json({ msg: "No Data Found" });
    try {
        await FAQ.destroy({
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "FAQ deleted successfuly" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
