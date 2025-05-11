import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
export const embeddModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
export default model;
