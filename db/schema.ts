import { sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Organisation Table
export const organisationTable = pgTable("organisation", {
  id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
  name: text("name").notNull(),
  plan: varchar("plan").notNull().default("free"),
  status: varchar("status").notNull().default("active"),
  settings: jsonb("settings").notNull().default({}),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Users Table
export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
  email: varchar("email", { length: 255 }).notNull(),
  name: text("name").notNull().default("User"),
  password: varchar("password").notNull(),
  role: varchar("role").notNull().default("user"),
  organisation_id: uuid("organisation_id").references(() => organisationTable.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Chatbots Table
export const chatbotsTable = pgTable("chatbots", {
  id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
  name: text("name").notNull(),
  description: varchar("description", { length: 255 }),
  organisation_id: uuid("organisation_id").references(() => organisationTable.id),
  api_key: varchar("api_key").notNull().unique(),
  settings: jsonb("settings").notNull().default({}),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});