import { fetchInvitation, joinOrganisation } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();
  const invitation = (await fetchInvitation(token))[0];

  if (
    !invitation ||
    invitation.status !== "PENDING" ||
    invitation.expires_at < new Date()
  ) {
    return NextResponse.json({ message: "Invalid or expired invitation", status: 409 });
  }

  const response = await joinOrganisation(
    invitation.orgId!,
    invitation.email,
    invitation.role!
  );
  console.log(25, "called join org");

  if (response.type == "error") {
    return NextResponse.json({ message: response.message, status: 409 });
  }

  return NextResponse.json({ message: response.message, status: 200 });
}
