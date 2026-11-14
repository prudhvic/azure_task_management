import { db } from "../db/config.js";
import { tasks } from "../db/schema.js";
import { and, eq } from "drizzle-orm";
import { AppError } from "../middleware/errorHandler.js";
export const getTasks = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }
        const taskList = await db
            .select()
            .from(tasks)
            .where(eq(tasks.userId, req.user.id));
        if (taskList.length === 0) {
            throw new AppError("No tasks found", 404);
        }
        return res.status(200).json({
            message: "Tasks fetched successfully",
            tasks: taskList
        });
    }
    catch (error) {
        next(error);
    }
};
export const getTaskById = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }
        const { id } = req.params;
        const [task] = await db
            .select()
            .from(tasks)
            .where(and(eq(tasks.id, id), eq(tasks.userId, req.user.id)));
        if (!task) {
            throw new AppError("Task not found", 404);
        }
        return res.status(200).json({
            message: "Task fetched successfully",
            task
        });
    }
    catch (error) {
        next(error);
    }
};
export const createTask = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }
        const { title, description, status, priority, dueDate } = req.body;
        const parsedDueDate = dueDate
            ? new Date(dueDate)
            : null;
        if (parsedDueDate &&
            Number.isNaN(parsedDueDate.getTime())) {
            throw new AppError("Invalid due date", 400);
        }
        const [task] = await db
            .insert(tasks)
            .values({
            title,
            description,
            status,
            priority,
            dueDate: parsedDueDate,
            userId: req.user.id
        })
            .returning();
        return res.status(201).json({
            message: "Task created successfully",
            task
        });
    }
    catch (error) {
        next(error);
    }
};
export const deleteTask = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }
        const { id } = req.params;
        const [deletedTask] = await db
            .delete(tasks)
            .where(and(eq(tasks.id, id), eq(tasks.userId, req.user.id)))
            .returning();
        if (!deletedTask) {
            throw new AppError("Task not found", 404);
        }
        return res.status(200).json({
            message: "Task deleted successfully"
        });
    }
    catch (error) {
        next(error);
    }
};
export const updateTask = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }
        const { id } = req.params;
        const { title, description, status, priority, dueDate } = req.body;
        const [task] = await db
            .select()
            .from(tasks)
            .where(and(eq(tasks.id, id), eq(tasks.userId, req.user.id)));
        if (!task) {
            throw new AppError("Task not found", 404);
        }
        const parsedDueDate = dueDate === undefined
            ? task.dueDate
            : dueDate === null || dueDate === ""
                ? null
                : new Date(dueDate);
        if (parsedDueDate &&
            Number.isNaN(parsedDueDate.getTime())) {
            throw new AppError("Invalid due date", 400);
        }
        const [updatedTask] = await db
            .update(tasks)
            .set({
            title: title ?? task.title,
            description: description ?? task.description,
            status: status ?? task.status,
            priority: priority ?? task.priority,
            dueDate: parsedDueDate,
            updatedAt: new Date()
        })
            .where(and(eq(tasks.id, id), eq(tasks.userId, req.user.id)))
            .returning();
        return res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=taskController.js.map