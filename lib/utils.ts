import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge class names, resolving Tailwind conflicts so the last utility wins.
 * Every primitive and collection uses this to make `className` overridable.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
