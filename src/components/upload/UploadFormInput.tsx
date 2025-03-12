"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface UploadFormInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const UploadFormInput = ({ onSubmit }: UploadFormInputProps) => {
  return (
    <div>
      <form action="" className="flex flex-col gap-6" onSubmit={onSubmit}>
        <Input
          id="file"
          name="file"
          type="file"
          accept="application/pdf"
          required
          className=""
        />
        <Button>Upload your pdf</Button>
      </form>
    </div>
  );
};

export default UploadFormInput;
