import { useUploadThing } from "@/lib/uploadthing";
import UploadFormInput from "./UploadFormInput";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid File" })
    .refine((file) => file.size <= 20 * 1024 * 1024, {
      message: "File size must be less than 20MB",
    })
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

const UploadForm = () => {
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      toast.success("File Uploaded Successfully!");
    },
    onUploadError: () => {
      toast.error("Error occured while uploading!");
    },
    onUploadBegin: ({ file }) => {
      console.log("Upload has begun for", file);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("submitted");
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    // Validating the fields
    const validatedFields = schema.safeParse({ file });

    console.log(validatedFields);

    if (!validatedFields.success) {
      console.log(
        validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid File"
      );

      return;
    }

    const res = await startUpload({ file });

    if (!res) return;

    // schema with zod
  };
  return (
    <>
      <div className="mx-auto flex-col gap-8 w-full max-w-2xl">
        <UploadFormInput onSubmit={handleSubmit} />
      </div>
    </>
  );
};

export default UploadForm;
