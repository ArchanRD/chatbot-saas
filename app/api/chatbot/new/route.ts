import { checkIfChatbotAlreadyCreated, createChatbot } from "@/lib/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    const getOrgsByOrgId = await checkIfChatbotAlreadyCreated(data.orgId);

    if (getOrgsByOrgId.length == 0) {
      await createChatbot(
        data.name,
        data.description,
        data.orgId,
        data.welcomeMessage
      );

      return NextResponse.json({
        message: "Chatbot created successfully!",
        status: 200,
      });
    } else {
      return NextResponse.json({
        message: "You have already created a chatbot",
        status: 409,
      });
    }
  } catch {
    return NextResponse.json({
      message: "Something went wrong!",
      status: 500,
    });
  }
}
