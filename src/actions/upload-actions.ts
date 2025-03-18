"use server";

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/gemini";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { formatFileNameAsTitle } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

interface PdfSummaryType {
  userId: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

// Function to convert Clerk ID to a valid UUID
function convertClerkIdToUuid(clerkId: string): string {
  // Create a deterministic UUID v5 using the Clerk ID as a namespace
  // This ensures the same Clerk ID always generates the same UUID

  // Define a namespace (using a UUID v4 as base)
  const NAMESPACE = "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d";

  // Generate a UUID v5 by hashing the Clerk ID with the namespace
  return crypto
    .createHash("sha1")
    .update(NAMESPACE + clerkId)
    .digest()
    .slice(0, 16)
    .toString("hex")
    .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
}

export async function generatePdfSummary(
  uploadResponse: Array<{
    serverData: {
      userId: string;
      file: {
        ufsUrl: string;
        name: string;
      };
    };
  }>
) {
  if (!uploadResponse?.length) {
    return { success: false, message: "File Upload Failed", data: null };
  }

  const {
    serverData: {
      userId,
      file: { ufsUrl: pdfUrl, name: fileName },
    },
  } = uploadResponse[0];

  if (!pdfUrl) {
    return { success: false, message: "File Upload Failed", data: null };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    const summary = await generateSummaryFromGemini(pdfText);
    const title = formatFileNameAsTitle(fileName);

    return {
      success: true,
      message: "Summary generated successfully",
      data: {
        summary,
        title,
        name: fileName,
      },
    };
  } catch (error) {
    console.error("Error generating PDF summary:", error);
    return {
      success: false,
      message: "Failed to generate summary",
      data: null,
    };
  }
}

async function storePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  try {
    const sql = await getDbConnection();

    // Convert the Clerk ID to a UUID using our helper function
    const userUuid = convertClerkIdToUuid(userId);
    console.log("Original Clerk ID:", userId);
    console.log("Converted UUID:", userUuid);

    // Check if user exists in users table first, create if not
    const userExists = await sql`
      SELECT id FROM users WHERE id = ${userUuid}::uuid LIMIT 1;
    `;

    if (userExists.length === 0) {
      // If user doesn't exist in our database yet, create a placeholder record
      // This assumes you have a separate process to fully register users
      await sql`
        INSERT INTO users (id, email, full_name)
        VALUES (
          ${userUuid}::uuid, 
          ${`temp_${userId}@example.com`}, 
          ${`User ${userId.substring(0, 8)}`}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    // Now insert the PDF summary with the converted UUID
    const result = await sql`
      INSERT INTO pdf_summaries (
        user_id,
        original_file_url,
        summary_text,
        title,
        file_name
      ) VALUES (
        ${userUuid}::uuid,
        ${fileUrl},
        ${summary},
        ${title},
        ${fileName}
      ) RETURNING id;
    `;

    return result.length > 0;
  } catch (error) {
    console.error("Error saving PDF summary:", error);
    const errorMessage = (error as Error).message || "Unknown error";
    console.error("Error saving PDF summary:", errorMessage);
    throw new Error(`Failed to save PDF summary: ${errorMessage}`);
  }
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: Omit<PdfSummaryType, "userId">) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }

    // Log the userId format we're getting from Clerk
    console.log("Clerk userId format:", userId);

    const savedSummary = await storePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });

    if (!savedSummary) {
      return {
        success: false,
        message: "Failed to save PDF summary, please try again...",
      };
    }

    return {
      success: true,
      message: "PDF summary saved successfully",
      data: {
        savedSummary,
        title,
      },
    };

    // // Revalidated our cache
    // revalidatePath(`/api/summary/${savedSummary.id}`);
    
  } catch (error) {
    console.error("Error in storePdfSummaryAction:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error saving PDF summary",
    };
  }
}
