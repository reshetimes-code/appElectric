import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ilsFormatter = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number) {
  return ilsFormatter.format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("he-IL").format(value);
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9֐-׿]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Uses the Web Crypto API (available in the browser, Node, and edge
// runtimes alike) instead of Math.random() — some of these ids (order
// numbers in particular) double as an unguessable access token for public,
// unauthenticated lookups, so they need real randomness, not just uniqueness.
export function genId(prefix = "id") {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const random = Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("");
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

export const AVAILABILITY_LABELS: Record<string, string> = {
  immediate: "זמין לאספקה מיידית",
  "in-stock": "במלאי",
  limited: "מלאי מוגבל",
  "personal-import": "ייבוא אישי – צרו קשר למועד אספקה",
  "out-of-stock": "אזל מהמלאי",
};

export const AVAILABILITY_TONE: Record<string, "success" | "warning" | "info" | "muted"> = {
  immediate: "success",
  "in-stock": "success",
  limited: "warning",
  "personal-import": "info",
  "out-of-stock": "muted",
};
