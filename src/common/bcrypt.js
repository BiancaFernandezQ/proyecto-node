import bcrypt from 'bcrypt';
import env from '../config/env.js';
import logger from '../logs/logger.js';

export const encriptar = async (text) => {
    try {
        const saltRounds = env.bcrypt_salt_rounds;
        return await bcrypt.hash(text, saltRounds)
    } catch (error) {
        logger.error(error)
        throw new Error('fallo de encriptacion')
    }
};

export const comparar = async (text, hash) => {
    try {
        return await bcrypt.compare(text, hash)
    } catch (error) {
        logger.error(error);
        throw new Error('fallo de encriptacion');
    }
};