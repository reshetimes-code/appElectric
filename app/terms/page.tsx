import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/ui/LegalPageLayout";
import { terms } from "@/lib/content/legalPages";

export const metadata: Metadata = { title: terms.title, description: terms.intro };

export default function TermsPage() {
  return <LegalPageLayout content={terms} />;
}
