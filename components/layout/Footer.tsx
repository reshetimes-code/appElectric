import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { FOOTER_LINK_GROUPS } from "@/lib/nav";
import { Phone, Mail, MapPin } from "lucide-react";

function InstagramGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 9h3V5h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4v-2a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 bg-charcoal-950 text-charcoal-200">
      <Container className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 lg:col-span-2">
          <Image src="/logo.png" alt="AppElectric" width={140} height={32} className="h-8 w-auto brightness-0 invert" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-charcoal-400">
            מכשירי חשמל ומטבח פרימיום, ייבוא אישי ושירות VIP אישי — מהייעוץ הראשוני ועד ההתקנה בבית.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href="#" aria-label="עמוד האינסטגרם שלנו" className="rounded-full border border-white/15 p-2 hover:border-white/40">
              <InstagramGlyph />
            </a>
            <a href="#" aria-label="עמוד הפייסבוק שלנו" className="rounded-full border border-white/15 p-2 hover:border-white/40">
              <FacebookGlyph />
            </a>
          </div>
          <div className="mt-6 flex flex-col gap-2 text-sm text-charcoal-400">
            <a href="tel:+972500000000" className="flex items-center gap-2 hover:text-white">
              <Phone size={14} /> 03-0000000
            </a>
            <a href="mailto:info@appelectric.co.il" className="flex items-center gap-2 hover:text-white">
              <Mail size={14} /> info@appelectric.co.il
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={14} /> שואו-רום בתיאום מראש, גוש דן
            </span>
          </div>
        </div>

        {FOOTER_LINK_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mb-3 text-sm font-semibold text-white">{group.title}</p>
            <ul className="flex flex-col gap-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-charcoal-400 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-charcoal-500 sm:flex-row">
          <p>© {new Date().getFullYear()} AppElectric. כל הזכויות שמורות. אתר הדגמה — תוכן ומחירים לצורכי הדגמה בלבד.</p>
          <div className="flex items-center gap-4">
            <Link href="/accessibility" className="hover:text-white">הצהרת נגישות</Link>
            <Link href="/privacy" className="hover:text-white">פרטיות</Link>
            <Link href="/terms" className="hover:text-white">תקנון</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
