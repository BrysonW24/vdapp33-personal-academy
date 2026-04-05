import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a display title to a URL-safe slug.
 * Must produce the same slugs that content manifests use.
 * e.g. "AI Researcher" → "ai-researcher"
 * e.g. "Navy SEAL / Maritime Special Operations Operator" → "navy-seal-maritime-special-operations-operator"
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}
