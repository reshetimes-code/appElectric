import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/ui/LegalPageLayout";
import { accessibility } from "@/lib/content/legalPages";

export const metadata: Metadata = { title: accessibility.title, description: accessibility.intro };

export default function AccessibilityPage() {
  return <LegalPageLayout content={accessibility} />;
}
