import { sql } from "drizzle-orm";
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Users Table
export const usersTable = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  email: varchar("email", { length: 255 }).notNull(),
  name: text("name").notNull().default("User"),
  password: varchar("password").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Organisation Table
export const organisationTable = pgTable("organisation", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  user_id: uuid("user_id").references(() => usersTable.id),
  name: text("name").notNull(),
  role: varchar("role").notNull().default("user"),
  plan: varchar("plan").notNull().default("free"),
  status: varchar("status").notNull().default("active"),
  settings: jsonb("settings").notNull().default({}),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Chatbots Table
export const chatbotsTable = pgTable("chatbots", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  name: text("name").notNull(),
  description: varchar("description", { length: 255 }),
  organisation_id: uuid("organisation_id").references(
    () => organisationTable.id
  ),
  api_key: varchar("api_key").notNull().unique(),
  settings: jsonb("settings").notNull().default({}),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

//files table
export const filesTable = pgTable("files", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  chatbot_id: uuid("chatbot_id").references(() => chatbotsTable.id),
  organisation_id: uuid("organisation_id").references(
    () => organisationTable.id
  ),
  name: text("name").notNull().unique(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});


export type Users = typeof usersTable.$inferSelect;
export type Organisation = typeof organisationTable.$inferSelect;
export type Chatbot = typeof chatbotsTable.$inferSelect;
export type Files = typeof filesTable.$inferSelect;