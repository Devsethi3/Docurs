"use client";

import { useState, useRef, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, FileText, Upload, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadFormInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isUploading?: boolean;
}

const UploadFormInput = forwardRef<HTMLFormElement, UploadFormInputProps>(
  ({ onSubmit, isUploading = false }, ref) => {
    const [fileName, setFileName] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Validate file type and size
        if (!file.type.includes("pdf")) {
          setFileError("Please select a PDF file");
          setFileName("");
          return;
        }

        if (file.size > 16 * 1024 * 1024) {
          setFileError("File size must be less than 16MB");
          setFileName("");
          return;
        }

        setFileError(null);
        setFileName(file.name);
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        // Validate file type and size
        if (!file.type.includes("pdf")) {
          setFileError("Please select a PDF file");
          return;
        }

        if (file.size > 16 * 1024 * 1024) {
          setFileError("File size must be less than 16MB");
          return;
        }

        setFileError(null);
        setFileName(file.name);

        // Update the file input
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;
        }
      }
    };

    const clearFile = () => {
      setFileName("");
      setFileError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (fileName && !fileError) {
        await onSubmit(e);
      }
    };

    const triggerFileInput = () => {
      fileInputRef.current?.click();
    };

    return (
      <form onSubmit={handleSubmit} className="w-full" ref={ref}>
        <Card className="p-6 mb-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Upload PDF Document</h2>

          {fileError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700 text-sm">{fileError}</p>
            </div>
          )}

          <input
            type="file"
            id="file"
            name="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
          />

          {!fileName ? (
            <div
              onClick={triggerFileInput}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed  rounded-lg p-8 cursor-pointer text-center transition-colors",
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              )}
            >
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400 mb-3" />
                <p className="text-lg font-medium text-gray-700 mb-1">
                  Drag and drop your PDF here
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  or click to browse files
                </p>
                <p className="text-xs text-gray-400">Maximum file size: 16MB</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-md">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-xs">
                      {fileName}
                    </p>
                    <p className="text-xs text-gray-500">PDF Document</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  disabled={isUploading}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <Button
              type="submit"
              disabled={isUploading || !fileName || !!fileError}
              className="w-full"
              variant="default"
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-gray-200 border-t-white rounded-full"></div>
                  <span>Uploading PDF...</span>
                </div>
              ) : (
                <span>Upload PDF</span>
              )}
            </Button>
          </div>
        </Card>
      </form>
    );
  }
);

UploadFormInput.displayName = "UploadFormInput";

export default UploadFormInput;
