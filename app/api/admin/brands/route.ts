import { NextResponse } from "next/server";
import { createAdminBrand } from "@/lib/server/adminBrands";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const nameHe = typeof body.nameHe === "string" ? body.nameHe : "";
  if (!nameHe.trim()) {
    return NextResponse.json({ error: "יש להזין שם מותג" }, { status: 400 });
  }
  const brand = await createAdminBrand(nameHe);
  return NextResponse.json({ brand }, { status: 201 });
}
