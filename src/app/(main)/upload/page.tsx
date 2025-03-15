"use client";

import UploadForm from "@/components/upload/UploadForm";

const UploadPage = () => {
  return (
    <>
      <div className="container py-24 sm:py-32 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-wide">
            Start Uploading your PDF's
          </h1>
          <p className="text-muted-foreground mt-4">
            Upload your PDF and let our AI do the magic!
          </p>
        </div>
        <UploadForm />
      </div>
    </>
  );
};

export default UploadPage;
