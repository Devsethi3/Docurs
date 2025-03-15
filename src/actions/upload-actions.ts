"use server";

import { generateSummaryFromGemini } from "@/lib/gemini";
import { fetchAndExtractPdfText } from "@/lib/langchain";

export async function generatePdfSummary(uploadResponse: {
  serverData: {
    userId: string;
    file: {
      url: string;
      name: string;
    };
  };
}) {
  if (!uploadResponse || !uploadResponse.serverData) {
    return {
      success: false,
      message: "File Upload Failed!",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: fileName },
    },
  } = uploadResponse;

  if (!pdfUrl) {
    return {
      success: false,
      message: "File Upload Failed!",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);

    let summary;

    try {
      summary = await generateSummaryFromGemini(pdfText);
      console.log({ summary });
    } catch (err) {
      console.log(err);
    }

    if (!summary) {
      return {
        success: false,
        message: "Failed to generate summary",
        data: null,
      };
    }

    return {
      success: true,
      message: "PDF text extracted successfully!",
      data: pdfText,
    };
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    return {
      success: false,
      message: "PDF processing failed!",
      data: null,
    };
  }
}
