// compo
"use client";

import { useCallback, useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import { FileText, Loader2 } from "lucide-react";

interface CustomUploadDropzoneProps {
  onUploadComplete?: (response: {
    fileUrl: string;
    fileKey: string;
    fileName: string;
  }) => void;
  maxFiles?: number;
}

export function CustomUploadDropzone({
  onUploadComplete,
  maxFiles = 1,
}: CustomUploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleClientUploadComplete = useCallback(
    (res: any[]) => {
      setIsUploading(false);
      toast.success(
        `${res.length} file${
          res.length === 1 ? "" : "s"
        } uploaded successfully!`
      );

      if (onUploadComplete && res[0]) {
        onUploadComplete({
          fileUrl: res[0].fileUrl,
          fileKey: res[0].fileKey,
          fileName: res[0].fileName,
        });
      }
    },
    [onUploadComplete]
  );

  const handleUploadError = useCallback((error: Error) => {
    setIsUploading(false);
    toast.error(`Upload error: ${error.message}`);
  }, []);

  return (
    <UploadDropzone
      endpoint="pdfUploader"
      onUploadBegin={() => setIsUploading(true)}
      onClientUploadComplete={handleClientUploadComplete}
      onUploadError={handleUploadError}
      className="ut-button:bg-primary ut-button:hover:bg-primary/90 ut-label:text-foreground ut-allowed-content:text-muted-foreground"
      content={{
        label: ({ isUploading }) => (
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
            ) : (
              <FileText className="h-10 w-10 text-gray-400" />
            )}
            <span className="font-medium">
              {isUploading
                ? "Uploading..."
                : "Drag & drop or click to upload PDF"}
            </span>
            <span className="text-xs text-gray-500">Max file size: 16MB</span>
          </div>
        ),
      }}
    />
  );
}
