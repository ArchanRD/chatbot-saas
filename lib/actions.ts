"use server";
import { db } from "@/db/db";
import {
  chatbotsTable,
  collaboratorsTable,
  embeddingsTable,
  filesTable,
  invitationsTable,
  organisationTable,
  usersTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { Users } from "@/db/schema";
import { supabase } from "./supabaseClient";

export const getUserByEmail = async (email: string) => {
  return await db.select().from(usersTable).where(eq(usersTable.email, email));
};

export const getUserDetailsByEmail = async (email: string) => {
  return await db.select().from(usersTable).where(eq(usersTable.email, email));
};

export const createUserFromGoogleAuth = async (email: string, name: string, googleId: string, image?: string) => {
  try {
    // Check if user already exists with this email or Google ID
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    
    if (existingUser.length > 0) {
      // If user exists but doesn't have a Google ID, update it
      if (!existingUser[0].googleId) {
        await db
          .update(usersTable)
          .set({
            googleId: googleId,
            image: image || existingUser[0].image,
            name: name || existingUser[0].name
          })
          .where(eq(usersTable.email, email));
      }
      return { error: false, message: "User already exists", user: existingUser[0] };
    }
    
    // Create new user
    const newUser = await db
      .insert(usersTable)
      .values({
        email: email,
        name: name || email.split("@")[0],
        googleId: googleId,
        image: image || null
      })
      .returning();
    
    return { error: false, message: "User created successfully", user: newUser[0] };
  } catch (error) {
    console.error("Error creating user from Google auth:", error);
    return { error: true, message: "Failed to create user" };
  }
};

export const createOrganisation = async (orgName: string, userId: string) => {
  const org = await db
    .select()
    .from(organisationTable)
    .where(eq(organisationTable.user_id, userId));

  if (org.length > 0) {
    return { error: true, message: "You have already created an organisation" };
  }

  const orgDetails = await db
    .insert(organisationTable)
    .values({
      name: orgName,
      user_id: userId,
      plan: "free",
    })
    .returning({ id: organisationTable.id, orgName: organisationTable.name });
  return {
    error: false,
    message: "Organisation created successfully",
    orgDetails,
  };
};

export const updateApiKey = async (apiKey: string, orgId: string) => {
  await db
    .update(organisationTable)
    .set({
      api_key: apiKey,
    })
    .where(eq(organisationTable.id, orgId));

  return { error: false, message: "Sucess" };
};

export const fetchOrgDetailsById = async (orgId: string) => {
  return await db
    .select()
    .from(organisationTable)
    .where(eq(organisationTable.id, orgId));
};

export const fetchOrganisationByUserId = async (userId: string) => {
  return await db
    .select({
      id: organisationTable.id,
      name: organisationTable.name,
      api_key: organisationTable.api_key,
      plan: organisationTable.plan,
      status: organisationTable.status,
      created_at: organisationTable.created_at,
    })
    .from(organisationTable)
    .where(eq(organisationTable.user_id, userId));
};

export const fetchOrgsWithCollaboration = async (email: string) => {
  return await db
    .select()
    .from(collaboratorsTable)
    .where(eq(collaboratorsTable.user_email, email));
};

export const isAlreadyCollaborator = async (email: string) => {
  return await db
    .select()
    .from(collaboratorsTable)
    .where(eq(collaboratorsTable.user_email, email));
};

export const createInvitationRecord = async (
  orgId: string,
  email: string,
  token: string,
  role: string,
  expires_at: Date
) => {
  return await db.insert(invitationsTable).values({
    email: email,
    orgId: orgId,
    token: token,
    role: role,
    expires_at: expires_at,
    status: "PENDING",
  });
};

export const fetchInvitation = async (token: string) => {
  return await db
    .select()
    .from(invitationsTable)
    .where(eq(invitationsTable.token, token));
};

export const joinOrganisation = async (
  orgId: string,
  email: string,
  role: string
) => {
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (user.length == 0) {
    return {
      type: "error",
      message: "User must be registered. Register and try again.",
    };
  }

  const isCollaborator = await isAlreadyCollaborator(email);
  if (isCollaborator.length > 0) {
    return {
      type: "error",
      message: "User with email is already a collaborator",
    };
  }
  console.log(108, email);

  await db.insert(collaboratorsTable).values({
    user_email: email,
    org_id: orgId,
    role: role,
    created_at: new Date(),
  });

  await db.update(invitationsTable).set({ status: "ACCEPTED" });

  return { type: "success", message: "You have joined the organisation" };
};

export const createChatbot = async (
  name: string,
  desc: string,
  orgId: string,
  welcome_mesg: string
) => {
  try {
    return await db.insert(chatbotsTable).values({
      name: name,
      description: desc,
      organisation_id: orgId,
      welcome_mesg,
    });
  } catch (error) {
    console.log("Error from actions", error);
    return { error };
  }
};

export const checkIfChatbotAlreadyCreated = async (orgId: string) => {
  return await db
    .select()
    .from(chatbotsTable)
    .where(eq(chatbotsTable.organisation_id, orgId));
};

export const fetchChatbotDetailsByOrgId = async (orgId: string) => {
  return await db
    .select()
    .from(chatbotsTable)
    .where(eq(chatbotsTable.organisation_id, orgId));
};

export const uploadFileEntry = async (
  filename: string,
  orgId: string,
  chatbotId: string,
  path: string,
  type: string
) => {
  try {
    const result = await db
      .insert(filesTable)
      .values({
        name: filename,
        type: type,
        url: path,
        chatbot_id: chatbotId,
        organisation_id: orgId,
      })
      .returning({ id: filesTable.id });

    return { error: false, data: result };
  } catch (error) {
    console.log("Error:", error);
    return { error: true, data: false };
  }
};

export const getFileByChatbotId = async (chatbotId: string) => {
  return await db
    .select()
    .from(filesTable)
    .where(eq(filesTable.chatbot_id, chatbotId));
};

export const removeFileById = async (fileId: string, path: string) => {
  const res = await db.delete(filesTable).where(eq(filesTable.id, fileId));
  console.log("[DEBUG] file path: ", path);
  const response = await supabase.storage.from("file uploads").remove([path]);

  if (res.rowCount == 1 && response.error === null) {
    return { error: false, message: "File removed successfully" };
  }

  return { error: true, message: "Failed to remove file" };
};

export const downloadFile = async (path: string) => {
  const { data, error } = await supabase.storage
    .from("file uploads")
    .download(path);

  if (error) {
    return { error: true, messsag: error.message };
  }

  return { error: false, data: data };
};

export const getFilePathByOrgId = async (orgId: string) => {
  return db
    .select({ id: filesTable.id })
    .from(filesTable)
    .where(eq(filesTable.organisation_id, orgId));
};

export const getFileEmbed = async (fileId: string) => {
  return db
    .select()
    .from(embeddingsTable)
    .where(eq(embeddingsTable.file_id, fileId));
};

export const getSupabaseBucket = async (
  bucketName: string,
  filePath: string
) => {
  console.log(filePath);
  return supabase.storage.from(bucketName).getPublicUrl(filePath);
};

export const fetchOrgByAPIKey = async (apiKey: string) => {
  const orgData = await db
    .select()
    .from(organisationTable)
    .where(eq(organisationTable.api_key, apiKey));

  if (orgData.length === 0) {
    return null;
  }

  return orgData[0];
};

export const storeVectorEmbedd = async (file_id: string, content) => {
  try {
    const result = await db.insert(embeddingsTable).values({
      embedding: content,
      file_id: file_id,
    });
    console.log("Vector embed log: ", result);
    return { error: false, message: "Embedding stored successfully" };
  } catch (error) {
    console.log("Error:", error);
    return { error: true, message: "Failed to store Embedding" };
  }
};

export const fetchCollaboratorsByOrgId = async (orgId: string) => {
  try {
    if (orgId === undefined || orgId == null) {
      return { error: true, message: "Invalid org id" };
    }

    const collaborators = await db
      .select({ email: collaboratorsTable.user_email })
      .from(collaboratorsTable)
      .where(eq(collaboratorsTable.org_id, orgId));

    return { error: false, data: collaborators };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Internal error, failed to fetch collaborators",
    };
  }
};

export const updateCorsDomain = async (orgId: string, corsDomain: string) => {
  try {
    await db
      .update(organisationTable)
      .set({ cors_domain: corsDomain })
      .where(eq(organisationTable.id, orgId));
    return { error: false, message: "Cors domain updated successfully" };
  } catch (error) {
    console.log(error);
    return { error: true, message: "Failed to update cors domain" };
  }
};