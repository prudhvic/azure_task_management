
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorHandler.js";
import {
    findTasksByUserId,
    findTaskById,
    createTask as createTaskRepo,
    updateTask as updateTaskRepo,
    deleteTask as deleteTaskRepo,
} from "../repositories/taskRepository.js";

export const getTasks = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }

        const taskList = await findTasksByUserId(req.user.id);

        return res.status(200).json({
            message: "Tasks fetched successfully",
            tasks: taskList,
        });
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }

        const task = await findTaskById(req.params.id as string, req.user.id);

        if (!task) {
            throw new AppError("Task not found", 404);
        }

        return res.status(200).json({
            message: "Task fetched successfully",
            task,
        });
    } catch (error) {
        next(error);
    }
};

export const createTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }

        const {
            title,
            description,
            status,
            priority,
            dueDate,
        } = req.body;

        const parsedDueDate =
            dueDate == null || dueDate === ""
                ? null
                : new Date(dueDate);

        if (
            parsedDueDate &&
            Number.isNaN(parsedDueDate.getTime())
        ) {
            throw new AppError("Invalid due date", 400);
        }

        const task = await createTaskRepo({
            title,
            description,
            status,
            priority,
            dueDate: parsedDueDate,
            userId: req.user.id,
        });

        return res.status(201).json({
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }

        const existingTask = await findTaskById(
            req.params.id as string,
            req.user.id
        );

        if (!existingTask) {
            throw new AppError("Task not found", 404);
        }

        const {
            title,
            description,
            status,
            priority,
            dueDate,
        } = req.body;

        const parsedDueDate =
            dueDate === undefined
                ? existingTask.dueDate
                : dueDate === null || dueDate === ""
                    ? null
                    : new Date(dueDate);

        if (
            parsedDueDate &&
            Number.isNaN(parsedDueDate.getTime())
        ) {
            throw new AppError("Invalid due date", 400);
        }

        const updatedTask = await updateTaskRepo(
            req.params.id as string,
            req.user.id,
            {
                title,
                description,
                status,
                priority,
                dueDate: parsedDueDate,
            }
        );

        if (!updatedTask) {
            throw new AppError("Task not found", 404);
        }

        return res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }

        const deletedTask = await deleteTaskRepo(
            req.params.id as string,
            req.user.id
        );

        if (!deletedTask) {
            throw new AppError("Task not found", 404);
        }

        return res.status(200).json({
            message: "Task deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
