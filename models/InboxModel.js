import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const INBOX = db.define('inbox',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Nama tidak boleh kosong"
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Email tidak boleh kosong"
            },
            isEmail: {
                args: true,
                msg: "Email tidak valid"
            }
        }
    },
    messageContent: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: "Pesan tidak boleh kosong"
            }
        }
    }
},{
    freezeTableName: true
});

export default INBOX;
// (async()=>{
//     await db.sync();
// })();