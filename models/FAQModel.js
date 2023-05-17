import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const FAQ = db.define('faq', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Question tidak boleh kosong"
            }
        }
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Answer tidak boleh kosong"
            }
        }
    }
}, {
    freezeTableName: true
});

export default FAQ;
// (async()=>{
//     await db.sync();
// })();