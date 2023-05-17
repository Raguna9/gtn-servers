import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Partner = db.define('partner',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    name:{
        type: DataTypes.STRING,
        allowNull: true,
        validate:{
            notEmpty: {
                args: true,
                msg: "Nama tidak boleh kosong"
            },
            len: [3, 100]
        }
    },
    image:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: {
                args: true,
                msg: "Image tidak boleh kosong"
            }
        }
    },
    urlImage:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: {
                args: true,
                msg: "Image tidak boleh kosong"
            }
        }
    }
},{
    freezeTableName: true
});

export default Partner;