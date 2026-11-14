
import type { Request, Response, NextFunction } from "express";
import { db } from "../db/config.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import {
    hashPassword,
    signJwtToken,
    verifyPassword
} from "../utils/auth.js";

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isPasswordValid = await verifyPassword(
            password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        const token = signJwtToken({
            id: user.id,
            email: user.email,
            name: user.name
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        next(error);
    }
};


export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, email, password } = req.body;

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (user) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await hashPassword(password);

        const [newUser] = await db
            .insert(users)
            .values({
                name,
                email,
                passwordHash: hashedPassword
            })
            .returning();

        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser?.id,
                name: newUser?.name,
                email: newUser?.email
            }
        });

    } catch (error) {
        next(error);
    }
};


export const logout = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        return res.status(200).json({
            message: "User logged out successfully"
        });

    } catch (error) {
        next(error);
    }
};
