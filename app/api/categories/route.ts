import { NextResponse } from "next/server";
import { getAdminCategories } from "@/lib/server/adminCategories";

// Public, read-only: lets client components (Header/MobileNav/DepartmentCards,
// which otherwise only see the static seed catalog) pick up admin-added
// categories too — same bridge pattern as GET /api/products.
export async function GET() {
  return NextResponse.json({ categories: await getAdminCategories() });
}
