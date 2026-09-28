import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_NUMBER } from "@/lib/siteConfig";

export function VipCta() {
  return (
    <section className="bg-brand-700 py-14 text-white sm:py-16">
      <Container className="flex flex-col items-center gap-5 text-center">
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">לא בטוחים מה מתאים לכם?</h2>
        <p className="max-w-xl leading-relaxed text-brand-50">
          קבעו ייעוץ VIP אישי — ללא עלות וללא התחייבות. נעזור לכם לבחור את המכשירים הנכונים למטבח שלכם.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("שלום, אשמח לייעוץ VIP")}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
            size="lg"
          >
            שיחת WhatsApp מיידית
          </Button>
          <Button href="/vip" variant="outline-light" size="lg">
            השאירו פרטים
          </Button>
        </div>
      </Container>
    </section>
  );
}
