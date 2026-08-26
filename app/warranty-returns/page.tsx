import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/ui/LegalPageLayout";
import { warrantyReturns } from "@/lib/content/legalPages";

export const metadata: Metadata = { title: warrantyReturns.title, description: warrantyReturns.intro };

export default function WarrantyReturnsPage() {
  return <LegalPageLayout content={warrantyReturns} />;
}
