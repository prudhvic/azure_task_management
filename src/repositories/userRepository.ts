
import { db } from "../db/config.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const findUserByEmail = async (email: string) => {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

    return user;
};

export const createUser = async (data: {
    name: string;
    email: string;
    passwordHash: string;
}) => {
    const [user] = await db
        .insert(users)
        .values(data)
        .returning();

    return user;
};
