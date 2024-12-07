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
  email: text("email").notNull().unique(),
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
  api_key: text("api_key"),
  name: text("name").notNull(),
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
  welcome_mesg: text("welcome_mesg").default("Hey! How can I help you?"),
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

export const collaboratorsTable = pgTable("collaborators", {
  id: uuid("collab_id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  user_email: text("user_email").references(() => usersTable.email),
  org_id: uuid("org_id").references(() => organisationTable.id),
  role: text("role").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const invitationsTable = pgTable("invitations", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  email: text("email").unique().notNull(),
  orgId: uuid("orgId").references(() => organisationTable.id),
  token: text("token"),
  role: text("role"),
  expires_at: timestamp("expires_at").notNull(),
  status: text("status").notNull().default("PENDING"),
});

export type Users = typeof usersTable.$inferSelect;
export type Organisation = typeof organisationTable.$inferSelect;
export type Chatbot = typeof chatbotsTable.$inferSelect;
export type Files = typeof filesTable.$inferSelect;
export type Collaborator = typeof collaboratorsTable.$inferSelect;
export type Invitation = typeof invitationsTable.$inferSelect;
