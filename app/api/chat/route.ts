import { NextRequest, NextResponse } from "next/server";
import model, { embeddModel } from "@/lib/gemini-model";
import {
  fetchFileByApiKey,
  getFilePathByOrgId,
  getSupabaseBucket,
} from "@/lib/actions";
import PdfParse from "pdf-parse";

// Middleware to handle CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001", // Specific origin instead of *
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true", // Important for credentials
};

const getFileType = async (fileUrl: string) => {
  try {
    const res = await fetch(fileUrl, { method: "HEAD" });
    if (res.status === 200) {
      return res.headers.get("content-type");
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error in fetching file type", error);
  }
};

const generateGeminiResponse = async (
  user_message: string,
  pdfResp: ArrayBuffer
) => {
  const modelResponse = await model.generateContent([
    {
      inlineData: {
        data: Buffer.from(pdfResp).toString("base64"),
        mimeType: "application/pdf",
      },
    },
    `Act as a bot. Start with the main answer of the question. Don't let customer know about the document you are provide. Answer only if the question is related to the information. If not, then say I cannot assist with that. Give answer in plain text and short. ${user_message}`,
  ]);
  return modelResponse;
};

export async function POST(request: NextRequest) {
  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return NextResponse.json({}, { headers: corsHeaders });
  }

  try {
    const {
      message: user_message,
      apiKey,
    }: {
      message: string;
      companyId: string;
      apiKey: string;
    } = await request.json();

    const greetings = [
      "hi",
      "hello",
      "hey",
      "good morning",
      "good evening",
      "good afternoon",
      "greetings",
    ];

    const { orgId } = await fetchFileByApiKey(apiKey);
    if (orgId == null) {
      return NextResponse.json(
        { message: "Chatbot Apikey is not set." },
        { headers: corsHeaders }
      );
    }

    const processedInput = user_message.toLowerCase().trim();
    if (greetings.includes(processedInput)) {
      return NextResponse.json(
        { message: "Hey, How can I assist you?" },
        { headers: corsHeaders }
      );
    }

    const fileDetails = await getFilePathByOrgId(orgId);
    const fileURL = (
      await getSupabaseBucket("file uploads", fileDetails[0].url)
    ).data.publicUrl;
    const fileType = await getFileType(fileURL);
    if (fileType !== null) {
      if (fileType === "application/pdf") {
        
        const pdf = await fetch(fileURL)
        const pdfBuffer = await pdf.arrayBuffer()
        console.log(pdfBuffer)
        const data = await PdfParse(Buffer.from(pdfBuffer))
        // console.log(data.text)

        const embeddResult = await embeddModel.embedContent(data.text)
        console.log(embeddResult.embedding.values)

        // const modelResponse = await generateGeminiResponse(
        //   user_message,
        //   pdfRespInCache
        // );
        return NextResponse.json(
          {
            message: 'a'
              // modelResponse?.response?.candidates?.[0].content.parts[0].text,
          },
          { headers: corsHeaders }
        );
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle OPTIONS requests
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}
