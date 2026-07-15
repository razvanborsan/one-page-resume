import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

/**
 * Merge conditional class names and dedupe conflicting Tailwind utilities.
 * Mirrors the shadcn/ui `cn` helper (clsx + tailwind-merge).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
