import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { Status } from '../constants/index.js';
import { Task } from './task.js';
import { encriptar } from '../common/bcrypt.js';


export const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    //nombre de usuario debe ser unico
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue('username', value?.trim().toLowerCase());
        },
        validate: {
            notNull: {
                msg: 'Ingrese nombre de usuario',
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Ingrese contrasenia',
            },
        },
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: Status.ACTIVE,
        validate: {
            isIn: {
                args: [[Status.ACTIVE, Status.INACTIVE]],
                msg: `El status debe ser ${Status.ACTIVE} o ${Status.INACTIVE}`,
            },
        },
    },
});

User.hasMany(Task);
Task.belongsTo(User);

/*User.hasMany(Task, {
    foreignKey: 'user_id',
    sourceKey: 'id',
});

Task.belongsTo(User, {
    foreignKey: 'user_id',
    sourceKey: 'id',
});*/

User.beforeCreate(async (user) => {
    user.password = await encriptar(user.password)
});

User.beforeUpdate(async (user) => {
    user.password = await encriptar(user.password);
});


