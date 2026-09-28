import { NextResponse } from "next/server";
import { getBundles, createBundle, type BundleInput } from "@/lib/server/adminBundles";

export async function GET() {
  return NextResponse.json({ bundles: await getBundles() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as BundleInput;
  if (!body.nameHe?.trim()) {
    return NextResponse.json({ error: "יש למלא שם לסט" }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "יש להוסיף לפחות מוצר אחד לסט" }, { status: 400 });
  }
  for (const item of body.items) {
    if (!item.productId || !Number.isFinite(item.price) || item.price < 0) {
      return NextResponse.json({ error: "מחיר לא תקין באחד המוצרים" }, { status: 400 });
    }
  }
  const bundle = await createBundle(body);
  return NextResponse.json({ bundle }, { status: 201 });
}
