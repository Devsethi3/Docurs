"use client";

import { useRef, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import UploadFormInput from "./UploadFormInput";
import { z } from "zod";
import { toast } from "sonner";
import { generatePdfSummary } from "@/actions/upload-actions";

const pdfSchema = z.object({
  file: z
    .instanceof(File, { message: "Invalid File" })
    .refine((file) => file.size <= 16 * 1024 * 1024, {
      message: "File size must be less than 16MB",
    })
    .refine((file) => file.type === "application/pdf", "File must be a PDF"),
});

const UploadForm = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: async (res) => {
      if (!res || res.length === 0) {
        toast.error("Upload failed - no response received");
        setIsUploading(false);
        return;
      }

      toast.success("File uploaded successfully!");

      try {
        // The response from UploadThing matches what generatePdfSummary expects
        const uploadResult = {
          serverData: {
            userId: res[0].serverData.userId,
            file: {
              url: res[0].url,
              name: res[0].name,
            },
          },
        };

        // Process the PDF using your server action
        const summaryResult = await generatePdfSummary(uploadResult);

        const { data = null, message = null } = summaryResult || {};

        if (summaryResult.success) {
          toast.success(summaryResult.message);
          setExtractedText(summaryResult.data);
          formRef.current?.reset();
        } else {
          toast.error(summaryResult.message);
        }
      } catch (error) {
        console.error("Error processing PDF:", error);
        toast.error("Error processing your PDF");
      } finally {
        setIsUploading(false);
      }
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      toast.error("Error uploading file: " + error.message);
      setIsUploading(false);
    },
    onUploadBegin: (file) => {
      toast.info(`Uploading ${file}...`);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    // Validate the file
    const validation = pdfSchema.safeParse({ file });

    if (!validation.success) {
      const errorMessage =
        validation.error.flatten().fieldErrors.file?.[0] ?? "Invalid file";
      toast.error(errorMessage);
      setIsUploading(false);
      return;
    }

    // Upload the file
    try {
      await startUpload([file]);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto flex flex-col gap-8 w-full max-w-2xl">
      <UploadFormInput
        ref={formRef}
        onSubmit={handleSubmit}
        isUploading={isUploading}
      />

      {extractedText && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Extracted PDF Content</h3>
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded p-4 text-sm">
            {extractedText}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
