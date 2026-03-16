import { User } from '../models/user.js';
import { Task } from '../models/task.js';
import logger from '../logs/logger.js';
import { Status } from '../constants/index.js';
import { encriptar } from '../common/bcrypt.js';
import { Op, UniqueConstraintError } from 'sequelize';

function normalizeUsername(username) {
    return username.trim().toLowerCase();
}

async function create(req, res) {
    const { username, password } = req.body;
    try {
        const normalizedUsername = normalizeUsername(username);
        const existingUser = await User.findOne({
            where: {
                username: {
                    [Op.iLike]: normalizedUsername,
                },
            },
        });

        if (existingUser) {
            return res.status(409).json({ message: 'El username ya existe' });
        }

        const newUser = await User.create({
            username: normalizedUsername,
            password
        });
        return res.json(newUser);
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ message: 'El username ya existe' });
        }
        logger.error(error);
        return res.json(error.message);
    }
}

async function get(_req, res) {
    try {
        const users = await User.findAndCountAll({
            attributes: ['id', 'username', 'password', 'status'],
            order: [['id', 'DESC']],
            where: {
                status: Status.ACTIVE
            }
        })
        res.json({
            total: users.count,
            data: users.rows
        })
    } catch (error) {
        logger.error(error);
        return res.json(error.message);
    }
};

async function find(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username', 'status'],
            where: {
                id,
            },
        });
        if (!user)
            return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        logger.error(error);
        return res.json(error.message);
    }
}

const update = async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    const passwordHash = await encriptar(password);

    try {
        const normalizedUsername = normalizeUsername(username);
        const existingUser = await User.findOne({
            where: {
                id: {
                    [Op.ne]: id,
                },
                username: {
                    [Op.iLike]: normalizedUsername,
                },
            },
        });

        if (existingUser) {
            return res.status(409).json({ message: 'El username ya existe' });
        }

        const user = await User.update(
            {
                username: normalizedUsername,
                password: passwordHash,
            },
            { where: { id } },
        );
        return res.json(user);
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ message: 'El username ya existe' });
        }
        logger.error(error);
        return res.json(error.message);
    }
};

const activateInactivate = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: 'No existe el status' });

    try {
        const user = await User.findByPk(id);

        if (!user) return res.status(400).json({ message: 'No existe el usuario' });

        if (user.status === status)
            return res
                .status(409)
                .json({ message: `El usuario ya se encuentra ${status}` });
        user.status = status
        await user.save();
        res.json(user);
    } catch (error) {
        logger.error(error);
        return res.json(error.message);
    }
};

const eliminar = async (req, res) => {
    const { id } = req.params;
    try {
        await Task.destroy({
            where: {
                userId: id,
            },
        });
        await User.destroy({
            where: {
                id,
            },
        });
        return res.sendStatus(204);
    } catch (error) {
        logger.error(error);
        return res.json(error.message);
    }
};

const getTasks = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username'],
            include: [
                {
                    model: Task,
                    attributes: ['name', 'done'],
                }
            ],
            where: { id },
        });
        return res.json(user);
    } catch (error) {
        logger.error(error);
        return res.json(error.message);
    }
};

async function getPagination(req, res) {
    let { page, limit, search, orderBy, orderDir } = req.query;

    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 10;
    search = search ? search : '';
    orderBy = orderBy ? orderBy : 'id';
    orderDir = orderDir ? orderDir : 'DESC';

    const offset = (page - 1) * limit;

    try {
        const users = await User.findAndCountAll({
            attributes: ['id', 'username', 'status'],
            limit,
            offset,
            order: [[orderBy, orderDir]],
            where: search
                ? {
                    username: {
                        [Op.iLike]: `%${search}%`,
                    },
                }
                : {},
        });

        const pages = Math.ceil(users.count / limit);

        res.json({
            total: users.count,
            page,
            pages,
            data: users.rows,
        });
    } catch (error) {
        logger.error(error);
        return res.json(error.message);
    }
}

export default {
    create,
    get,
    find,
    update,
    eliminar,
    activateInactivate,
    getTasks,
    getPagination,
};
