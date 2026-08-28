import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not set in .env"
  );
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Model dùng chung toàn dự án
export const GEMINI_MODEL = "gemini-3.1-flash-lite";