import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/actions";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Check if user exists
  const user = await getUserByEmail(email);
  if (user.length > 0) {
    return NextResponse.json({ success: false, message: "User already exists" });
  }

  // Create a new user
  await createUser(email, password);

  return NextResponse.json({ success: true, message: "User created successfully" });
}
