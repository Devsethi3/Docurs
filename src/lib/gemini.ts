import { SUMMARY_SYSTEM_PROMPT } from "./prompts";

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

export async function generateSummaryFromGemini(
  pdfText: string
): Promise<{ summary: string; success: boolean }> {
  // Validate environment variable
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not defined in environment variables");
    return { summary: "", success: false };
  }

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(apiKey);

  // Get the model
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temprature: 0.7,
      maxOutputTokens: 1500,
    },
  });

  // Configure generation parameters
  const generationConfig = {
    temperature: 0.7, // Slightly lower temperature for more focused output
    topP: 0.95, // Keep diversity high
    topK: 40, // Standard top-k filtering
    maxOutputTokens: 4096, // Capping at 4k tokens for summary
    responseMimeType: "text/plain",
  };

  // Generate summary prompt
  const prompt = {
    contents: [
      {
        role: "user",
        parts: [
          { text: SUMMARY_SYSTEM_PROMPT },
          {
            text: `${SUMMARY_SYSTEM_PROMPT}\n\nTransform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${trimText(
              pdfText,
              25000
            )}`,
          },
        ],
      },
    ],
  };

  try {
    // Initialize chat session
    const chatSession = model.startChat({
      generationConfig,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      history: [],
    });

    // Send the prompt to Gemini
    const result = await chatSession.sendMessage(prompt);
    const summary = result.response.text();

    return {
      summary,
      success: true,
    };
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    return {
      summary: "Failed to generate summary. Please try again later.",
      success: false,
    };
  }
}

/**
 * Trims text to avoid exceeding token limits
 * @param text - The text to trim
 * @param maxChars - Maximum number of characters
 * @returns Trimmed text
 */
function trimText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return (
    text.substring(0, maxChars) + "\n\n[Document truncated due to length...]"
  );
}
