import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Matel = db.define('matel', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true
            }
        }
    },
    kontrak: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true
            }
        }
    },
    nopol: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true
            }
        }
    },
    nosin: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true
            }
        }
    },
    noka: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true
            }
        }
    },
    merkType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true
            }
        }
    },
    overdue: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: {
                args: true
            }
        }
    },
    finance: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true
            }
        }
    }
}, {
    freezeTableName: true
});

export default Matel;
// (async()=>{
//     await db.sync();
// })();