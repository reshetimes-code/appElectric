import { LEGAL_ENTITY_NAME_HE, LEGAL_ADDRESS, LEGAL_PHONE, LEGAL_FAX, LEGAL_BUSINESS_ID } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

/** The registered company's letterhead details, shown under the logo on official documents and the site footer. */
export function LogoLetterhead({ className }: { className?: string }) {
  return (
    <div className={cn("text-xs leading-relaxed", className)}>
      <p className="font-semibold">{LEGAL_ENTITY_NAME_HE}</p>
      <p>{LEGAL_ADDRESS}</p>
      <p>
        טלפון: {LEGAL_PHONE} · פקס: {LEGAL_FAX}
      </p>
      <p>עוסק מורשה {LEGAL_BUSINESS_ID}</p>
    </div>
  );
}
