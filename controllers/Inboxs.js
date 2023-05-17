import Inbox from "../models/InboxModel.js";

export const getInboxs = async (req, res) => {
    try {
        const response = await Inbox.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getInboxCount = async (req, res) => {
    try {
        const count = await Inbox.count();
        return res.status(200).json({ count });
    } catch (error) {
        return res.status(500).json({ msg: "Terjadi kesalahan saat mengambil jumlah data" });
    }
};

export const getInboxById = async (req, res) => {
    try {
        const response = await Inbox.findOne({
            where: {
                uuid: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createInbox = async (req, res) => {
    const { name, email, messageContent } = req.body;
    try {
        await Inbox.create({
            name: name,
            email: email,
            messageContent: messageContent
        });
        res.status(201).json({ msg: "Inbox Berhasil Ditambahkan" });
    } catch (error) {
        let message = error.message;
        if (message.includes("Validation error:")) {
            message = message.split("Validation error: ")[1];
        }
        res.status(400).json({ msg: message });;
    }
}

// export const updateInbox = async (req, res) => {
//     const inbox = await Inbox.findOne({
//         where: {
//             uuid: req.params.id
//         }
//     });
//     if (!inbox) return res.status(404).json({ msg: "Inbox tidak ditemukan" });
//     const { name, email, messageContent } = req.body;
//     try {
//         await Inbox.update({
//             name: name,
//             email: email,
//             messageContent: messageContent
//         }, {
//             where: {
//                 id: inbox.id
//             }
//         });
//         res.status(200).json({ msg: "Inbox updated successfuly" });
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// }

export const deleteInbox = async (req, res) => {
    const inbox = await Inbox.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!inbox) return res.status(404).json({ msg: "No Data Found" });
    try {
        await Inbox.destroy({
            where: {
                id: inbox.id
            }
        });
        res.status(200).json({ msg: "Inbox deleted successfuly" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
