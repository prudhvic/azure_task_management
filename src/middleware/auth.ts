import type { NextFunction, Request, Response } from "express";
import { verifyJwtToken } from "../utils/auth.js";

export function authorizeToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const decodedToken = verifyJwtToken(token) as { id: string, email: string, name: string };
        req.user = {
            id: decodedToken.id,
            email: decodedToken.email,
            name: decodedToken.name
        };
        next();

    } catch (error) {
        console.log("Unable to authorize user", error)
        res.status(500).json({ message: "Unable to authorize user" })
    }
}