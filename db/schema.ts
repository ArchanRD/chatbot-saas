import { sql } from "drizzle-orm";
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  vector,
} from "drizzle-orm/pg-core";

// Users Table
export const usersTable = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default("User"),
  googleId: text("google_id").unique(),
  image: text("image"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Organisation Table
export const organisationTable = pgTable("organisation", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  user_id: text("user_id").references(() => usersTable.googleId),
  api_key: text("api_key").unique(),
  name: text("name").notNull(),
  plan: varchar("plan").notNull().default("free"),
  status: varchar("status").notNull().default("active"),
  settings: jsonb("settings").notNull().default({}),
  cors_domain: text("cors_domain").notNull().default(""),
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
  tone: text("tone").default("friendly"),
  answer_style: text("answer_style").default("concise"),
  logo_url: text("logo_url"),
  theme: jsonb("theme").default({
    primary_color: "#4F46E5",
    text_color: "#1F2937",
    font_family: "Inter",
    font_size: "medium",
    border_radius: 8,
    chat_position: "bottom-right"
  }),
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
  email: text("email").notNull(),
  orgId: uuid("orgId").references(() => organisationTable.id),
  token: text("token"),
  role: text("role"),
  expires_at: timestamp("expires_at").notNull(),
  status: text("status").notNull().default("PENDING"),
});

export const embeddingsTable = pgTable("embeddings", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  file_id: uuid("file_id").references(() => filesTable.id),
  embedding: vector("embedding", { dimensions: 768 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Users = typeof usersTable.$inferSelect;
export type Organisation = typeof organisationTable.$inferSelect;
export type Chatbot = typeof chatbotsTable.$inferSelect;
export type Files = typeof filesTable.$inferSelect;
export type Collaborator = typeof collaboratorsTable.$inferSelect;
export type Invitation = typeof invitationsTable.$inferSelect;
export type Embedding = typeof embeddingsTable.$inferSelect;
