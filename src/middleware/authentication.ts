import { Request, Response, NextFunction } from 'express';

import jwt from "jsonwebtoken";

export const verifyJwtToken = (req: Request , res: Response, next: NextFunction): void => {
    const token = req.headers['authorization'];
    if (!token) {
        res.status(403).send({ message: "No token provided!" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        next();
    }
    catch (err) {
        res.status(401).send({ message: "Unauthorized!" });
    }
};
