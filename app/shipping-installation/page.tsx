import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/ui/LegalPageLayout";
import { shippingInstallation } from "@/lib/content/legalPages";

export const metadata: Metadata = { title: shippingInstallation.title, description: shippingInstallation.intro };

export default function ShippingInstallationPage() {
  return <LegalPageLayout content={shippingInstallation} />;
}
