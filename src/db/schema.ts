import { sql } from "drizzle-orm";
import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    check,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", { length: 100 }).notNull(),

    email: varchar("email", { length: 255 })
        .notNull()
        .unique(),

    passwordHash: text("password_hash").notNull(),

    createdAt: timestamp("created_at").defaultNow(),

    updatedAt: timestamp("updated_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
    id: uuid("id").primaryKey().defaultRandom(),

    title: varchar("title", { length: 200 }).notNull(),

    description: text("description"),

    status: varchar("status", { length: 30 })
        .default("todo")
        .notNull(),

    priority: varchar("priority", { length: 20 })
        .default("medium")
        .notNull(),

    dueDate: timestamp("due_date"),

    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow(),

    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
    check(
        "tasks_status_check",
        sql`${table.status} IN ('todo', 'in-progress', 'done')`
    ),
    check(
        "tasks_priority_check",
        sql`${table.priority} IN ('low', 'medium', 'high')`
    ),
]);