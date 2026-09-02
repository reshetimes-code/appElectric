import { NextResponse } from "next/server";
import { getAdminProducts } from "@/lib/server/adminProducts";

// Public, read-only: lets client components (cart/favorites/compare, which only
// persist product IDs to localStorage) resolve admin-added products too, since
// those live in a server-only file store the client can't read directly.
export async function GET() {
  return NextResponse.json({ products: getAdminProducts() });
}
