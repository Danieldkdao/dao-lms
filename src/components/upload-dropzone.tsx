"use client";

import { useState, useRef, useCallback, DragEvent, ChangeEvent } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { UploadCloudIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";

export const UploadDropzone = ({
  onFilesSelected,
  onFileDelete,
  accept = "*",
  multiple = false,
  values,
  onChange,
}: {
  onFilesSelected: (files: File[]) => Promise<void>;
  onFileDelete: (file: File) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  values: File[];
  onChange: (files: File[]) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = useCallback(
    (files: File[]) => {
      if (!multiple && files.length > 1) {
        setError("Only one file is allowed.");
        return false;
      }
      if (accept !== "*") {
        const allowedTypes = accept.split(",").map((t) => t.trim());
        const allValid = Array.from(files).every((file) =>
          allowedTypes.some(
            (type) => file.type === type || file.name.endsWith(type),
          ),
        );
        if (!allValid) {
          setError(`Invalid file type. Allowed: ${accept}`);
          return false;
        }
      }
      setError("");
      return true;
    },
    [accept, multiple],
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      const fileArray = Array.from(files);
      if (!validateFiles(fileArray)) return;
      try {
        await onFilesSelected(fileArray);
      } catch {
        return;
      }
      onChange(fileArray);
    },
    [validateFiles, onFilesSelected, onChange],
  );

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer?.files ?? [];
    if (files && files.length > 0) {
      handleFiles([...files]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files ?? [];
    if (files && files.length > 0) {
      handleFiles([...files]);
    }
  };

  const handleRemoveFile = async (index: number) => {
    try {
      await onFileDelete(values[index]);
    } catch (error) {
      console.error(error);
      return;
    }
    const updated = values.filter((_, i) => i !== index);
    onChange(updated);
  };

  const generateImagePreview = useCallback((file: File) => {
    const previewUrl = URL.createObjectURL(file);
    return previewUrl;
  }, []);

  return (
    <div className="w-full mx-auto">
      {/* Dropzone Area */}
      {values.length ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-2xl h-60",
            "border-input bg-input dark:bg-input/30 hover:bg-input/10 dark:hover:bg-input/40 p-10 flex items-center justify-center relative",
          )}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFile(0);
            }}
            aria-label="Remove file"
            size="icon"
            variant="destructive"
            className="absolute top-4 right-4 z-10"
            type="button"
          >
            <XIcon />
          </Button>
          <div className="h-40 max-w-120 w-full rounded-sm absolute">
            <Image
              src={generateImagePreview(values?.[0])}
              alt="Image Preview"
              fill
              className="object-cover"
            />
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-2xl",
            "cursor-pointer transition-all duration-300 h-60",
            isDragging
              ? "border-primary bg-primary/10 scale-[1.02]"
              : "border-input bg-input dark:bg-input/30 hover:bg-input/10 dark:hover:bg-input/40",
          )}
        >
          <Label className="w-full h-full cursor-pointer flex flex-col items-center justify-center p-10">
            {/* Icon */}
            <div
              className={cn(
                "size-20 rounded-full flex items-center justify-center border-2 bg-card transition-all duration-300",
                isDragging && "bg-primary/10 border-primary",
              )}
            >
              <UploadCloudIcon
                className={cn(
                  "size-10 transition-all duration-300",
                  isDragging && "text-primary",
                )}
              />
            </div>

            {/* Text */}
            <p
              className={cn(
                "text-base font-medium text-center transition-all duration-300",
                isDragging && "text-primary",
              )}
            >
              {isDragging
                ? "Release to drop your files here!"
                : "Drag & drop files here, or click to browse"}
            </p>
            <p
              className={cn(
                "text-muted-foreground text-sm mt-1 text-center transition-all duration-300",
                isDragging && "text-primary/70",
              )}
            >
              {accept === "*"
                ? "All file types accepted"
                : `Accepted: ${accept}`}
            </p>

            {/* Hidden File Input */}
            <Input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              className="hidden"
              onChange={handleInputChange}
            />
          </Label>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium text-center">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};
