import { NextRequest, NextResponse } from "next/server";
import { fetchOrgByAPIKey, fetchChatbotDetailsByOrgId } from "@/lib/actions";

export async function GET(req: NextRequest) {
  try {
    // Get the API key from the query parameters
    const apiKey = req.nextUrl.searchParams.get("apiKey");
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    // Fetch organization details using the API key
    const orgDetails = await fetchOrgByAPIKey(apiKey);
    
    if (!orgDetails) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    // Fetch chatbot details for this organization
    const chatbotDetails = await fetchChatbotDetailsByOrgId(orgDetails.id);
    
    if (!chatbotDetails || chatbotDetails.length === 0) {
      return NextResponse.json(
        { error: "No chatbot found for this organization" },
        { status: 404 }
      );
    }

    // Return the chatbot configuration
    const chatbot = chatbotDetails[0];
    
    return NextResponse.json({
      id: chatbot.id,
      name: chatbot.name,
      description: chatbot.description,
      welcome_mesg: chatbot.welcome_mesg,
      tone: chatbot.tone,
      answer_style: chatbot.answer_style,
      logo_url: chatbot.logo_url,
      theme: chatbot.theme,
      organisation_id: chatbot.organisation_id
    });
  } catch (error) {
    console.error("Error fetching widget configuration:", error);
    return NextResponse.json(
      { error: "Failed to fetch widget configuration" },
      { status: 500 }
    );
  }
}
