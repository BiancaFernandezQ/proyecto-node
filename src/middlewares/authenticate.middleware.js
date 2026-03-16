import jwt from "jsonwebtoken";
import env from "../config/env.js";

export function authenticateToken(req, res, next) {
    //token de headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    //decode token
    jwt.verify(token, env.jwt_secret, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    });
}