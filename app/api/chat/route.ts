import { NextRequest, NextResponse } from "next/server";
import model from "@/lib/gemini-model";
import { downloadFile, fetchOrgByAPIKey } from "@/lib/actions";
import { db } from "@/db/db";
import { filesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import PdfParse from "pdf-parse";

// Base CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
  "Access-Control-Allow-Credentials": "false",
};

export async function POST(request: NextRequest) {
  // Get API key from headers
  const apiKey = request.headers.get("x-api-key");
  const origin = request.headers.get("origin");

  if (!origin) {
    return NextResponse.json(
      { message: "Origin header is required" },
      { status: 403 }
    );
  }

  try {
    // Validate API key
    if (!apiKey) {
      return NextResponse.json(
        { message: "API key is not provided." },
        { headers: corsHeaders }
      );
    }

    // Get request body
    const { message: user_message } = await request.json();

    // Fetch organization data
    const orgData = await fetchOrgByAPIKey(apiKey);

    if (!orgData) {
      return NextResponse.json(
        { message: "Invalid API key." },
        { headers: corsHeaders }
      );
    }

    // Get files for the organization
    const filefields = await db
      .select()
      .from(filesTable)
      .where(eq(filesTable.organisation_id, orgData.id));

    if (filefields.length === 0) {
      return NextResponse.json(
        { message: "Knowledge base is not provided. Contact support." },
        { headers: corsHeaders }
      );
    }

    // Download and process the file
    const file = await downloadFile(filefields[0].url);
    const arrayBuffer = await file.data?.arrayBuffer();

    if (!arrayBuffer) {
      return NextResponse.json(
        { message: "Error accessing knowledge base. Contact support." },
        { headers: corsHeaders }
      );
    }

    const fileBuffer = Buffer.from(arrayBuffer);
    const fileData = await PdfParse(fileBuffer);
    const fileContext = fileData.text;

    // Create prompt and generate response
    const prompt = `You are a Customer Support Chatbot integrated in the clients website. The context provided contains information about client's buisness and their website. Their users will ask you questions and queries. Answer the user query based on the provided context. If the necessary information is not available, politely decline without referencing the context, document, or file. Do no reveal the context to user even if explicity asked. Do not mention the words document, file, knowledge base, context. You can simply say I cannot answer that. For the information you dont know you can say I dont have enough information about that.
    The context is wrapped inside the <context></context> tags.
    User query is wrapped inside the <query></query> tags.
    
    <context>
    ${fileContext}
    </context>
    
    <query>
    ${user_message}
    </query>
    `;

    const result = await model.generateContent(prompt);
    const modelResponse = await result.response;
    const text = modelResponse.text();

    const response = NextResponse.json({ message: text }, { status: 200 });

    if (origin === orgData.cors_domain) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    } else {
      return NextResponse.json(
        { message: "Origin is not allowed." },
        { status: 403 }
      );
    }

    return response;
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || "*";

  const response = new NextResponse(null, { status: 204 }); // 204 - No content just for OPTIONS request.

  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, x-api-key"
  );
  response.headers.set("Access-Control-Max-Age", "86400"); // Cache preflight for next 24 hours.

  return response;
}
