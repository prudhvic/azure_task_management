import express from "express"
import tasksRouter from "./routes/tasks.js"
import usersRouter from "./routes/users.js"
import CookieParser from "cookie-parser"
import { errorHandler } from "./middleware/errorHandler.js"
import cors from "cors"
export const app = express()

app.use(express.json())
app.use(CookieParser())
app.use(cors())


app.use("/api/v1", tasksRouter)


app.use("/api/v1/users", usersRouter)


app.use(errorHandler);