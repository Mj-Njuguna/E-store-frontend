import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with tailwind-merge for clean class merging
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
