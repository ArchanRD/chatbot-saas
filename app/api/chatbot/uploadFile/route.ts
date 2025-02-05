import { NextRequest, NextResponse } from "next/server";
import PdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = (formData.get("file") as File) || null;
  
  if(!file){
    return NextResponse.json({error: "No file uploaded"}, {status: 400})
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer())
  const parsedPDF = PdfParse(fileBuffer)

  console.log((await parsedPDF).text)
  return NextResponse.json({message: "File uploaded successfully"}, {status: 200});
}
