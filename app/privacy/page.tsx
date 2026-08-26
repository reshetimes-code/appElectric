import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/ui/LegalPageLayout";
import { privacy } from "@/lib/content/legalPages";

export const metadata: Metadata = { title: privacy.title, description: privacy.intro };

export default function PrivacyPage() {
  return <LegalPageLayout content={privacy} />;
}
