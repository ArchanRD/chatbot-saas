import { createInvitationRecord, isAlreadyCollaborator } from "@/lib/actions";
import { sendEmail } from "@/lib/email/send";
import { emailTemplates } from "@/lib/email/templates";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, orgId, role, orgName} = await req.json();

  // Check if collaborator already exists
  const isCollaborator = await isAlreadyCollaborator(email);
  if (isCollaborator.length > 0) {
    return NextResponse.json({
      message: "Collaborator already exists",
      status: 409,
    });
  }

  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + 7 * 2 * 60 * 60 * 1000); // 7 days

  await createInvitationRecord(orgId, email, token, role, expiresAt);

  const inviteURL = `${process.env.NEXT_PUBLIC_APP_URL}/invite?token=${token}`;
  const { html, subject } = emailTemplates.invitation(inviteURL, orgName);

  await sendEmail({
    to: email,
    subject: subject,
    html: html,
    from: "Conversy <no-reply@archan.dev>",
  });

  return NextResponse.json({ message: "Invitation Sent", status: 200 });
}
