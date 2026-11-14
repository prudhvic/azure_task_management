
import { db } from "../db/config.js";
import { tasks } from "../db/schema.js";
import { and, eq } from "drizzle-orm";

export const findTasksByUserId = async (userId: string) => {
    return await db
        .select()
        .from(tasks)
        .where(eq(tasks.userId, userId));
};

export const findTaskById = async (
    taskId: string,
    userId: string
) => {
    const [task] = await db
        .select()
        .from(tasks)
        .where(
            and(
                eq(tasks.id, taskId),
                eq(tasks.userId, userId)
            )
        );

    return task;
};

export const createTask = async (data: {
    title: string;
    description?: string | null;
    status?: string;
    priority?: string;
    dueDate?: Date | null;
    userId: string;
}) => {
    const [task] = await db
        .insert(tasks)
        .values(data)
        .returning();

    return task;
};

export const updateTask = async (
    taskId: string,
    userId: string,
    data: {
        title?: string;
        description?: string | null;
        status?: string;
        priority?: string;
        dueDate?: Date | null;
        updatedAt?: Date;
    }
) => {
    const [updatedTask] = await db
        .update(tasks)
        .set({
            ...data,
            updatedAt: new Date()
        })
        .where(
            and(
                eq(tasks.id, taskId),
                eq(tasks.userId, userId)
            )
        )
        .returning();

    return updatedTask;
};

export const deleteTask = async (
    taskId: string,
    userId: string
) => {
    const [deletedTask] = await db
        .delete(tasks)
        .where(
            and(
                eq(tasks.id, taskId),
                eq(tasks.userId, userId)
            )
        )
        .returning();

    return deletedTask;
};
