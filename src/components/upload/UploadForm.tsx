"use client";

import { useRef, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import UploadFormInput from "./UploadFormInput";
import { z } from "zod";
import { toast } from "sonner";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { formatFileNameAsTitle } from "@/lib/utils";
import { SummaryResponse, UploadResponse } from "@/types/upload";
import { useRouter } from "next/navigation";


const pdfSchema = z.object({
  file: z
    .instanceof(File, { message: "Invalid File" })
    .refine((file) => file.size <= 16 * 1024 * 1024, {
      message: "File size must be less than 16MB",
    })
    .refine((file) => file.type === "application/pdf", "File must be a PDF"),
});

const UploadForm = () => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => 
      setIsUploading(false);
    },
    onUploadError: (error) => {
      toast.error(`❌ Upload Failed: ${error.message}`);
      setIsUploading(false);
    },
    onUploadBegin: (file) => {
      toast.info(`🔄 Uploading ${file}...`);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    const validatedFields = pdfSchema.safeParse({ file });

    if (!validatedFields.success) {
      toast.error(
        `❌ ${
          validatedFields.error.flatten().fieldErrors.file?.[0] ??
          "Invalid File"
        }`
      );
      setIsUploading(false);
      return;
    }

    try {
      
      const uploadPromise = startUpload([file]);

     
      const uploadLoadingToast = toast.loading("🔄 Uploading PDF...");

      const uploadResult = (await uploadPromise) as unknown as UploadResponse[];

      toast.dismiss(uploadLoadingToast);
      toast.success("📄 PDF Uploaded Successfully!");

      if (
        !uploadResult ||
        !Array.isArray(uploadResult) ||
        uploadResult.length === 0
      ) {
        toast.error("❌ Something went wrong with the upload");
        setIsUploading(false);
        return;
      }

      const summaryLoadingToast = toast.loading("🤖 Generating Summary...");

  
      const summaryResponse = (await generatePdfSummary(
        uploadResult
      )) as unknown as SummaryResponse;
      setSummaryResult(JSON.stringify(summaryResponse));

      toast.dismiss(summaryLoadingToast);

      if (!summaryResponse.success || !summaryResponse.data) {
        toast.error(
          `❌ ${summaryResponse.message || "Failed to generate summary"}`
        );
        setIsUploading(false);
        return;
      }

      toast.success("✅ Summary Generated!");

      const summaryData = summaryResponse.data;
      let summaryText = "";

      if (typeof summaryData.summary === "string") {
        summaryText = summaryData.summary;
      } else if (
        typeof summaryData.summary === "object" &&
        summaryData.summary !== null
      ) {
        if (
          "summary" in summaryData.summary &&
          typeof summaryData.summary.summary === "string"
        ) {
          summaryText = summaryData.summary.summary;
        } else if (
          "text" in summaryData.summary &&
          typeof summaryData.summary.text === "string"
        ) {
          summaryText = summaryData.summary.text;
        } else {
          summaryText = JSON.stringify(summaryData.summary);
        }
      }

      const savingLoadingToast = toast.loading("💾 Saving Summary...");

      const saveResult = await storePdfSummaryAction({
        summary: summaryText,
        fileUrl: uploadResult[0].serverData.file.ufsUrl,
        title: summaryData.title || formatFileNameAsTitle(summaryData.name),
        fileName: summaryData.name,
      });

      // Dismiss
      toast.dismiss(savingLoadingToast);

      if (saveResult.success) {
        toast.success("🎉 PDF Summary Saved Successfully!");
      } else {
        toast.error(`❌ ${saveResult.message || "Failed to save summary"}`);
      }

      formRef.current?.reset();
      // Todo: Redirect to the [id] summary 

    } catch (error) {
      toast.error(
        `❌ ${
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        }`
      );
    } finally {
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

      {summaryResult && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Summary Result:</h3>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(JSON.parse(summaryResult), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
