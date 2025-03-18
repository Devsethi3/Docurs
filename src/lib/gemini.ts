import { SUMMARY_SYSTEM_PROMPT } from "./prompts";
import { trimText } from "./utils";

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

/**
 * Generates a summary from PDF text using Google's Gemini AI
 * @param pdfText - The extracted text from the PDF document
 * @returns Promise containing the generated summary
 */
export async function generateSummaryFromGemini(pdfText: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not defined in environment variables");
    return { summary: "", success: false };
  }

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);

    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1500,
    };

    // Get the model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig,
    });

    // Create prompt
    const prompt = `${SUMMARY_SYSTEM_PROMPT}\n\nTransform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${trimText(
      pdfText,
      25000
    )}`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return { summary, success: true };
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    return {
      summary: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
