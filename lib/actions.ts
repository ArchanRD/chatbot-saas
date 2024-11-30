"use server";
import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { Users } from "@/db/schema";


export const getUserByEmail = async (email: string) => {
  return await db.select().from(usersTable).where(eq(usersTable.email, email));
};

export const getUserDetailsByEmail = async (email: string) => {
  return await db.select().from(usersTable).where(eq(usersTable.email, email));
};

export const verifyUserPassword = async (user: Users, password: string) => {
  return await bcrypt.compare(password, user.password);
};

export const createUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return await db.insert(usersTable).values({
    email: email,
    password: hashedPassword,
    name: "user",
  });
};
