// Utility function for combining CSS classes
// Uses clsx for conditional classes and tailwind-merge to handle conflicts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  // clsx handles the conditional logic, twMerge resolves Tailwind conflicts
  // For example: cn("p-4", "p-2") would result in just "p-2" (the last one wins)
  return twMerge(clsx(inputs));
}