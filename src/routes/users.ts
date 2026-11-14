import { Router } from "express";
import { db } from "../db/config.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { hashPassword, signJwtToken, verifyPassword } from "../utils/auth.js";

const router = Router()


router.post("/login", async (req, res, next) => {

    try {
        const { email, password } = req.body;
        const [user] = await db.select().from(users).where(eq(users.email, email)).execute();
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        const isPasswordValid = await verifyPassword(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" })
        }
        const token = signJwtToken({ id: user.id, email: user.email, name: user.name })

        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "lax" });
        res.status(200).json({ message: "User logged in successfully", user })

    } catch (error) {
        console.log("Unable to login user", error)
        next(error)
    }
})

router.post("/signup", async (req, res, next) => {
    console.log("Signup user")
    try {
        const { name, email, password } = req.body;
        const [user] = await db.select().from(users).where(eq(users.email, email)).execute();
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }
        console.log("Creating user", name, email)
        const hashedPassword = await hashPassword(password);
        const [newUser] = await db.insert(users).values({
            name,
            email,
            passwordHash: hashedPassword
        }).returning().execute();
        res.status(201).json({ message: "User created successfully", user: newUser })

    } catch (error) {
        console.log("Unable to signup user", error)
        next(error)
    }
})


router.post("/logout", (req, res, next) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "lax" });
        res.status(200).json({ message: "User logged out successfully" })
    } catch (error) {
        console.log("Unable to logout user", error)
        next(error)
    }
})

export default router;