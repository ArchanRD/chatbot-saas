"use server";
import { db } from "@/db/db";
import { collaboratorsTable, organisationTable, usersTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
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
    name: email.split("@")[0],
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

  if (org.length > 0) {
    return { error: true, message: "You have already created an organisation" };
  }

  await db.insert(organisationTable).values({
    name: orgName,
    user_id: userId,
    plan: "free",
    role: role,
  });
  return { error: false, message: "Organisation created successfully" };
};

export const fetchAllOrganisations = async () => {
  return await db.select().from(organisationTable);
};

export const fetchOrganisationByUserId = async (orgId: string) => {
  const res = await db.select().from(organisationTable).where(eq(organisationTable.user_id, orgId));
  console.log(res);
  return res;
}

export const joinOrganisation = async (orgId: string, userId: string) => {
  const isAlreadyCollaborator = await db
    .select()
    .from(collaboratorsTable)
    .where(
      and(
        eq(collaboratorsTable.org_id, orgId),
        eq(collaboratorsTable.user_id, userId)
      )
    );

  if (isAlreadyCollaborator.length > 0) {
    return { success: false, message: "Already a collaborator" };
  }

  await db.insert(collaboratorsTable).values({
    user_id: userId,
    org_id: orgId,
  });
  return { success: true, message: "You have joined the organisation" };
};
