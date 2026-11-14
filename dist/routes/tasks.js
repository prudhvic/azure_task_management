import { Router } from "express";
import { authorizeToken } from "../middleware/auth.js";
import { getTasks, getTaskById, createTask, deleteTask, updateTask } from "../controllers/taskController.js";
const router = Router();
router.use(authorizeToken);
router.get("/tasks", getTasks);
router.get("/tasks/:id", getTaskById);
router.post("/tasks", createTask);
router.patch("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);
export default router;
//# sourceMappingURL=tasks.js.map