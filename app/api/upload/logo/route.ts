import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { supabase } from "@/lib/supabaseClient";
import { updateChatbotById } from "@/lib/actions";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const chatbotId = formData.get("chatbotId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!chatbotId) {
      return NextResponse.json({ error: "Chatbot ID is required" }, { status: 400 });
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    // Create a unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `logo_${chatbotId}_${timestamp}.${fileExt}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from("file uploads")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "public, max-age=31536000",
        upsert: true
      });

    if (error) {
      console.error("Supabase storage error:", error);
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

    // Get the public URL
    const { data: publicUrlData } = supabase
      .storage
      .from("file uploads")
      .getPublicUrl(fileName);

    const logoUrl = publicUrlData.publicUrl;

    // Update the chatbot with the logo URL
    const updateResult = await updateChatbotById(chatbotId, { logo_url: logoUrl });

    if (updateResult.error) {
      return NextResponse.json({ error: updateResult.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: "Logo uploaded successfully", 
      logoUrl 
    });
  } catch (error) {
    console.error("Error uploading logo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
