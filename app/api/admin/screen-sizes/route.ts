import { NextResponse } from "next/server";
import { createAdminScreenSize } from "@/lib/server/adminScreenSizes";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const size = Number(body.size);
  if (!Number.isFinite(size) || size <= 0) {
    return NextResponse.json({ error: "יש להזין גודל מסך תקין" }, { status: 400 });
  }
  const screenSizes = await createAdminScreenSize(size);
  return NextResponse.json({ screenSizes }, { status: 201 });
}
