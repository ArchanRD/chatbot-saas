import { createOrganisation } from "@/lib/actions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { orgName, userId } = await req.json();

  const result = await createOrganisation(orgName, userId);
  if (result.error) {
    return NextResponse.json({ error: true, message: result.message });
  }

  return NextResponse.json(
    {
      error: false,
      message: result.message,
      orgId: result.orgDetails![0].id,
      orgName: result.orgDetails![0].orgName,
    },
    { status: 200 }
  );
}
