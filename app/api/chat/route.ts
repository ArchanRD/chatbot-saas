import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, res: NextResponse) {
  const user_message = await request.json();

  const response = NextResponse.json({ message: "hello from next js api" });

  response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, {status: 200})

  response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}
