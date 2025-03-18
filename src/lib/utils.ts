import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Trims text to avoid exceeding token limits
 * @param text - The text to trim
 * @param maxChars - Maximum number of characters
 * @returns Trimmed text
 */
export function trimText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return (
    text.substring(0, maxChars) + "\n\n[Document truncated due to length...]"
  );
}

export function formatFileNameAsTitle(fileName: string): string {
  // Remove file extension and replace special characters with spaces
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");

  const withSpaces = withoutExtension
    .replace(/[-_]/g, " ") // Replace dashes and underscores with spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2"); // Add space between camelCase

  // Convert to title case (capitalize first letter of each word)
  return withSpaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
}
