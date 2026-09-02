import { NextResponse } from "next/server";
import { getSuppliers, createSupplier, type SupplierInput } from "@/lib/server/suppliers";

export async function GET() {
  return NextResponse.json({ suppliers: getSuppliers() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as SupplierInput;
  if (!body.name?.trim() || !body.email?.trim() || !body.whatsapp?.trim()) {
    return NextResponse.json({ error: "יש למלא שם, מייל ווואטסאפ" }, { status: 400 });
  }
  const supplier = createSupplier(body);
  return NextResponse.json({ supplier }, { status: 201 });
}
