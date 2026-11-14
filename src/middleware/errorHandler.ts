
import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";

export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler: ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";

    // PostgreSQL errors
    switch (err.code) {
        case "23505":
            statusCode = 409;
            message = "A record with this value already exists";
            break;

        case "23503":
            statusCode = 400;
            message = "Referenced record does not exist";
            break;

        case "23514":
            statusCode = 400;
            message = "Invalid value. Check the allowed values";
            break;

        case "22P02":
            statusCode = 400;
            message = "Invalid input format";
            break;
    }

    // Zod validation errors
    if (err instanceof ZodError) {
        statusCode = 400;
        message = err.issues.map(issue => issue.message).join(", ");
    }

    // JWT errors
    if (err instanceof jwt.TokenExpiredError) {
        statusCode = 401;
        message = "Your token has expired. Please log in again";
    } else if (err instanceof jwt.JsonWebTokenError) {
        statusCode = 401;
        message = "Invalid authentication token";
    }

    console.error("ERROR:", err);

    res.status(statusCode).json({
        success: false,
        status: statusCode >= 500 ? "error" : "fail",
        message:
            statusCode >= 500 && process.env.NODE_ENV === "production"
                ? "Something went wrong on the server"
                : message,
    });
};
