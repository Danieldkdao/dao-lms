"use client";

import {
  useState,
  useRef,
  useCallback,
  DragEvent,
  ChangeEvent,
  useEffect,
} from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { UploadCloudIcon, XIcon } from "lucide-react";
import { cn, generateFileUrl } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { PresignedUrlResponse } from "@/features/courses/lib/types";

const createFileKey = (file: File, keyPrefix: string) => {
  const safeFileName = file.name
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-");

  return `${keyPrefix.replace(/\/+$/, "")}/${crypto.randomUUID()}-${safeFileName}`;
};

const uploadFileWithProgress = (
  url: string,
  file: File,
  onProgress: (progress: number) => void,
) => {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;

      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 204) {
        onProgress(100);
        resolve();
        return;
      }

      reject(new Error(`Upload failed with status ${xhr.status}`));
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed"));
    };

    xhr.open("PUT", url);

    if (file.type) {
      xhr.setRequestHeader("Content-Type", file.type);
    }

    xhr.send(file);
  });
};

export const UploadDropzone = ({
  accept = "*",
  keyPrefix,
  value,
  onChange,
  emptyValue = "",
  uploadMessage = "File uploaded successfully.",
  deleteMessage = "File deleted successfully.",
}: {
  accept?: string;
  keyPrefix: string;
  value?: string | null;
  onChange: (key: string | null) => void;
  emptyValue?: "" | null;
  uploadMessage?: string;
  deleteMessage?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = localPreviewUrl || (value ? generateFileUrl(value) : "");
  const acceptedTypes = accept
    .split(",")
    .map((type) => type.trim())
    .filter(Boolean);
  const isVideoPreview = acceptedTypes.some((type) => type.includes("video"));

  useEffect(() => {
    if (!localPreviewUrl) return;

    return () => URL.revokeObjectURL(localPreviewUrl);
  }, [localPreviewUrl]);

  useEffect(() => {
    if (!value) return;

    setLocalPreviewUrl("");
  }, [value]);

  const validateFiles = useCallback(
    (files: File[]) => {
      if (files.length > 1) {
        setError("Only one file is allowed.");
        return false;
      }
      if (accept !== "*") {
        const allowedTypes = accept.split(",").map((t) => t.trim());
        const allValid = Array.from(files).every((file) =>
          allowedTypes.some(
            (type) =>
              file.type === type ||
              (type.endsWith("/*") &&
                file.type.startsWith(type.replace("/*", "/"))) ||
              file.name.toLowerCase().endsWith(type.toLowerCase()),
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
    [accept],
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      const fileArray = Array.from(files);
      const fileToUpload = fileArray[0];

      if (!fileToUpload) return;
      if (!validateFiles(fileArray)) return;

      const key = createFileKey(fileToUpload, keyPrefix);
      const objectUrl = URL.createObjectURL(fileToUpload);
      setLocalPreviewUrl(objectUrl);
      setIsUploading(true);
      setUploadProgress(0);

      try {
        const presignedResponse = await fetch("/api/s3/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
        });

        const presignedPayload =
          (await presignedResponse.json()) as PresignedUrlResponse;
        const presignedUrl = presignedPayload.data?.url;

        if (!presignedResponse.ok || presignedPayload.error || !presignedUrl) {
          throw new Error(
            presignedPayload.message || "Failed to get upload URL.",
          );
        }

        await uploadFileWithProgress(
          presignedUrl,
          fileToUpload,
          setUploadProgress,
        );

        onChange(key);
        toast.success(uploadMessage);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to upload file.";

        setLocalPreviewUrl("");
        setUploadProgress(0);
        toast.error(message);
      } finally {
        setIsUploading(false);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    },
    [keyPrefix, onChange, uploadMessage, validateFiles],
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

  const handleRemoveFile = async () => {
    if (!value) {
      setLocalPreviewUrl("");
      onChange(emptyValue);
      return;
    }

    setIsDeleting(true);

    try {
      const presignedResponse = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: value }),
      });

      const presignedPayload =
        (await presignedResponse.json()) as PresignedUrlResponse;
      const presignedUrl = presignedPayload.data?.url;

      if (!presignedResponse.ok || presignedPayload.error || !presignedUrl) {
        throw new Error(
          presignedPayload.message || "Failed to get delete URL.",
        );
      }

      const deleteResponse = await fetch(presignedUrl, { method: "DELETE" });

      if (!deleteResponse.ok) {
        throw new Error("Failed to delete file from storage.");
      }

      setLocalPreviewUrl("");
      setUploadProgress(0);
      onChange(emptyValue);
      toast.success(deleteMessage);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete file.";

      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Dropzone Area */}
      {previewUrl ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-2xl h-60",
            "border-input bg-tranparent dark:bg-input/30 hover:bg-input/10 dark:hover:bg-input/40 p-10 flex items-center justify-center relative",
          )}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFile();
            }}
            aria-label="Remove file"
            size="icon"
            variant="destructive"
            className="absolute top-4 right-4 z-10"
            type="button"
            disabled={isUploading || isDeleting}
          >
            <XIcon />
          </Button>
          <div className="h-40 max-w-120 w-full rounded-sm relative flex items-center justify-center">
            {isVideoPreview ? (
              <video
                src={previewUrl}
                controls
                width={300}
                preload="metadata"
                style={{ borderRadius: "6px" }}
              />
            ) : (
              <Image
                src={previewUrl}
                alt="Image Preview"
                fill
                sizes="(max-width: 48rem) calc(100vw - 5rem), 30rem"
                className="object-cover"
              />
            )}
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
              className="hidden"
              onChange={handleInputChange}
            />
          </Label>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium text-center">
          {error}
        </p>
      )}
      {(isUploading || isDeleting) && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{isUploading ? "Uploading..." : "Deleting..."}</span>
            {isUploading && <span>{uploadProgress}%</span>}
          </div>
          {isUploading && <Progress value={uploadProgress} />}
        </div>
      )}
    </div>
  );
};
