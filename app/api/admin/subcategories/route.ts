import { NextResponse } from "next/server";
import { getAllCategories } from "@/lib/server/adminCategories";
import { addAdminSubcategory } from "@/lib/server/adminSubcategories";
import { genId, slugify } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const categoryId = typeof body.categoryId === "string" ? body.categoryId : "";
  const nameHe = typeof body.nameHe === "string" ? body.nameHe.trim() : "";
  if (!categoryId || !nameHe) {
    return NextResponse.json({ error: "יש לבחור קטגוריה ולהזין שם תת-קטגוריה" }, { status: 400 });
  }

  const category = (await getAllCategories()).find((c) => c.id === categoryId);
  if (!category) {
    return NextResponse.json({ error: "קטגוריה לא נמצאה" }, { status: 404 });
  }

  const baseSlug = slugify(nameHe) || genId("subcategory");
  let slug = baseSlug;
  let n = 2;
  while (category.subcategories.some((s) => s.slug === slug)) {
    slug = `${baseSlug}-${n++}`;
  }

  const subcategory = { id: `admin-sub-${genId()}`, slug, nameHe };
  await addAdminSubcategory(categoryId, subcategory);
  return NextResponse.json({ subcategory }, { status: 201 });
}
