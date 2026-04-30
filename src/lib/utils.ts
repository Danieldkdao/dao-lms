import { clsx, type ClassValue } from "clsx";
import { FieldError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const borderRedError = (fieldError: FieldError | undefined) =>
  fieldError && "border-destructive";

export const generateSlug = (text: string, uniqueIdentifier?: string) => {
  if (!text.trim()) return "";
  return (
    text.toLowerCase().replaceAll(/\s+/g, "-") +
    (uniqueIdentifier ? `-${uniqueIdentifier}` : "")
  );
};
