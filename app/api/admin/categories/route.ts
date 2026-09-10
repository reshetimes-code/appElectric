import { NextResponse } from "next/server";
import { createAdminCategory } from "@/lib/server/adminCategories";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const nameHe = typeof body.nameHe === "string" ? body.nameHe : "";
  if (!nameHe.trim()) {
    return NextResponse.json({ error: "יש להזין שם קטגוריה" }, { status: 400 });
  }
  const category = await createAdminCategory(nameHe);
  return NextResponse.json({ category }, { status: 201 });
}
