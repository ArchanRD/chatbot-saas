import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/actions";

export async function POST(req: Request) {
  const { email } = await req.json();

  // Check if user exists
  const user = await getUserByEmail(email);
  if (user.length > 0) {
    return NextResponse.json({ success: false, message: "User already exists" });
  }

  return NextResponse.json({ success: true, message: "User created successfully" });
}
