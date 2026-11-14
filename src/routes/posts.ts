import { Router } from "express"
import { authorizeToken } from "../middleware/auth.js"
import { db } from "../db/config.js"
import { tasks } from "../db/schema.js"
import { and, eq } from "drizzle-orm"

const router = Router()

router.get("/tasks", authorizeToken, async (req, res, next) => {

    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const task = await db.select().from(tasks).where(eq(tasks.userId, req.user.id)).execute();
        if (!task) {
            return res.status(404).json({ message: "No tasks found" })
        }
        res.status(200).json({ message: "Tasks fetched successfully", tasks: task })

    } catch (error) {
        console.log("Unable to fetch tasks", error)
        next(error)
    }
})

router.get("/tasks/:id", authorizeToken, async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const taskId = req.params.id;
        const [task] = await db
            .select()
            .from(tasks)
            .where(
                and(
                    eq(tasks.id, taskId as string),
                    eq(tasks.userId, req.user.id)
                )
            )
            .execute();
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        res.status(200).json({ message: "Task fetched successfully", task })
    } catch (error) {
        console.log("Unable to fetch task", error)
        next(error)
    }
})

router.post("/tasks", authorizeToken, async (req, res, next) => {

    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const { title, description, status, priority, dueDate
        } = req.body;
        const [task] = await db.insert(tasks).values({
            title,
            description,
            status,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            userId: req.user.id,

        }).returning().execute();
        res.status(201).json({ message: "Task created successfully", task })

    } catch (error) {
        console.log("Unable to create task", error)
        next(error)
    }

})


router.delete("/tasks/:id", authorizeToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        await db.delete(tasks).where(and(eq(tasks.id, id as string), eq(tasks.userId, req.user.id))).execute();
        res.status(200).json({ message: "Task deleted successfully" })
    } catch (error) {
        console.log("Unable to delete task", error)
        next(error)
    }
})

router.patch("/tasks/:id", authorizeToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, dueDate } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const [task] = await db.select().from(tasks).where(and(eq(tasks.id, id as string), eq(tasks.userId, req.user.id))).execute();
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        const updatedTask = await db.update(tasks).set({
            title: title || task.title,
            description: description || task.description,
            status: status || task.status,
            priority: priority || task.priority,
            dueDate: dueDate || task.dueDate
        }).where(and(eq(tasks.id, id as string), eq(tasks.userId, req.user.id))).returning().execute();

        res.status(200).json({ message: "Task updated successfully", task: updatedTask[0] })
    } catch (error) {
        console.log("Unable to update task", error)
        next(error)
    }
})

export default router