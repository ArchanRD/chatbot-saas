"use server";
import { db } from "@/db/db";
import { organisationTable, usersTable } from "@/db/schema";
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

export const createOrganisation = async (
  orgName: string,
  userId: string,
  role: string
) => {
  const org = await db
    .select()
    .from(organisationTable)
    .where(eq(organisationTable.user_id, userId));

    console.log("ORG LENGTH", org.length);

  if (org.length > 0) {
    return {error: true, message: "org already created"}
  }

  const result = await db.insert(organisationTable).values({
    name: orgName,
    user_id: userId,
    plan: "free",
    role: role,
  })
  return JSON.stringify(result);
};
