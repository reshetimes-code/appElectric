import { NextResponse } from "next/server";

const LIMITS = { nameHe: 500, model: 200, shortDescriptionHe: 2000, descriptionHe: 20000 } as const;
const LABELS = { nameHe: "שם המוצר", model: "דגם", shortDescriptionHe: "תיאור קצר", descriptionHe: "תיאור" } as const;
const MAX_IMAGES = 30;

/** Returns a Hebrew message telling the admin which field is too long / too many, or null when fine. */
export function validateProductSize(body: Partial<Record<keyof typeof LIMITS, string>> & { images?: string[] }): string | null {
  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    const len = body[key]?.length ?? 0;
    if (len > LIMITS[key]) {
      return `השדה "${LABELS[key]}" ארוך מדי (${len} תווים, מקסימום ${LIMITS[key]}). יש לקצר אותו.`;
    }
  }
  if ((body.images?.length ?? 0) > MAX_IMAGES) {
    return `יש יותר מדי תמונות (מקסימום ${MAX_IMAGES} למוצר). יש להסיר תמונות.`;
  }
  return null;
}

/** Turns an unexpected server failure into a readable Hebrew message instead of an empty 500. */
export function saveFailedResponse(e: unknown) {
  console.error("Product save failed:", e);
  const msg = e instanceof Error ? e.message : "";
  const tooBig = /exceeds the maximum allowed size|too large|INVALID_ARGUMENT/i.test(msg);
  return NextResponse.json(
    {
      error: tooBig
        ? "נפח הנתונים של המוצר גדול מדי לשמירה. יש לקצר את התיאורים או להסיר תמונות ולנסות שוב."
        : "השמירה נכשלה בגלל תקלה בשרת. נסו שוב בעוד רגע, ואם זה חוזר — פנו למפתח.",
    },
    { status: 500 },
  );
}
