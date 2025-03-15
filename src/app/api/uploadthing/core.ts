import { currentUser } from "@clerk/nextjs/server";
import { UploadThingError } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Define file upload handlers
export const ourFileRouter = {
  // Route for PDF uploads with a 16MB limit
  pdfUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(async () => {
      // Verify user authentication
      const user = await currentUser();
      if (!user) throw new UploadThingError("Unauthorized - Please sign in");

      // Return user metadata to be available in onUploadComplete
      return {
        userId: user.id,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Return the expected format that matches what generatePdfSummary expects
      return {
        userId: metadata.userId,
        file: {
          url: file.url,
          name: file.name,
        },
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
