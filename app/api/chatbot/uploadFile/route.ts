import { storeVectorEmbedd, uploadFileEntry } from "@/lib/actions";
import { embeddModel } from "@/lib/gemini-model";
import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";
import PdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = (formData.get("file") as File) || null;
  console.log(formData);

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  /**
   * Upload file to supabase storage bucket
   */
  const unique_filename = new Date().getTime() + "__" + file.name;
  const saveToStorage = await supabase.storage
    .from("file uploads")
    .upload(`uploads/${unique_filename}`, file);
  if (saveToStorage.error) {
    return NextResponse.json(
      { error: saveToStorage.error.message },
      { status: 500 }
    );
  }
  const savedFileData = saveToStorage.data;

  /**
   * Upload file information to database
   */
  const orgId = formData.get("orgId") as string | null;
  const chatbotId = formData.get("chatbotId") as string | null;
  if (!orgId || !chatbotId) {
    return NextResponse.json(
      { error: "Missing orgId or chatbotId" },
      { status: 400 }
    );
  }
  const fileEntryResult = await uploadFileEntry(
    unique_filename,
    orgId,
    chatbotId,
    savedFileData.path,
    file.type
  );
  if (fileEntryResult.error == true) {
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
  /**
   * Create and store file embedding in database
   */
  const fileBuffer = Buffer.from(await file.arrayBuffer())
  const parsedPDF = PdfParse(fileBuffer)

  const fileEmbedd = await embeddModel.embedContent((await parsedPDF).text)
  const storeVector = await storeVectorEmbedd(fileEntryResult.data[0].id, fileEmbedd.embedding.values)


  return NextResponse.json(
    { message: "File uploaded successfully" },
    { status: 200 }
  );
}
