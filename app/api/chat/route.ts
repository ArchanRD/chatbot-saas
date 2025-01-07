import { NextRequest, NextResponse } from "next/server";
import model from "@/lib/gemini-model";
import { getFileIdByOrgId, getSupabaseBucket } from "@/lib/actions";

export async function POST(request: NextRequest) {
  const {
    message: user_message,
    companyId,
  }: { message: string; companyId: string } = await request.json();

  const greetings = [
    "hi",
    "hello",
    "hey",
    "good morning",
    "good evening",
    "good afternoon",
    "greetings",
  ];

  /**
   * Direct response to greetings
   */
  const processedInput = user_message.toLowerCase().trim();
  if (greetings.includes(processedInput)) {
    const response = NextResponse.json({
      message: "Hey, How can I assist you?",
    });
    response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  }

  // get fileId by orgId
  const file = await getFileIdByOrgId(companyId);

  const fileURL = (await getSupabaseBucket("file uploads", file[0].url)).data
    .publicUrl;

  const pdfResp = await fetch(fileURL).then((res) => res.arrayBuffer());

  /**
   * Model api request
   */
  const modelResponse = await model.generateContent([
    {
      inlineData: {
        data: Buffer.from(pdfResp).toString("base64"),
        mimeType: "application/pdf",
      },
    },
    `Answer only if the question is related to the information. If not, then say I cannot assist with that. ${user_message}`,
  ]);

  const response = NextResponse.json({
    message: modelResponse?.response?.candidates?.[0].content.parts[0].text,
  });

  response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}
