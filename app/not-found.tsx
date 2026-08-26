import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CompassIcon } from "lucide-react";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-4 py-24 text-center">
      <CompassIcon size={36} className="text-charcoal-300" />
      <p className="font-heading text-5xl font-bold text-charcoal-900">404</p>
      <p className="font-heading text-lg font-semibold text-charcoal-800">הדף שחיפשתם לא נמצא</p>
      <p className="max-w-sm text-sm text-charcoal-500">ייתכן שהקישור שגוי או שהדף הוסר. נסו לחזור לעמוד הבית או לחפש את המוצר שאתם מחפשים.</p>
      <div className="mt-2 flex gap-3">
        <Button href="/">חזרה לעמוד הבית</Button>
        <Button href="/shop" variant="secondary">מעבר לחנות</Button>
      </div>
    </Container>
  );
}
