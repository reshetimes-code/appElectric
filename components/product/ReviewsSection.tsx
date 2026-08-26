import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import type { Review } from "@/lib/types";

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <h2 className="font-heading text-xl font-semibold text-charcoal-900">חוות דעת לקוחות</h2>
        {reviews.length > 0 && (
          <span className="flex items-center gap-2 text-sm text-charcoal-500">
            <Rating value={avg} />
            {avg.toFixed(1)} ({reviews.length} חוות דעת)
          </span>
        )}
      </div>
      {reviews.length === 0 ? (
        <p className="text-sm text-charcoal-500">אין עדיין חוות דעת למוצר זה.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-[var(--radius-card)] border border-sand-300 p-4">
              <div className="mb-1.5 flex items-center justify-between">
                <Rating value={r.rating} />
                {r.verifiedPurchase && <Badge tone="success">רכישה מאומתת</Badge>}
              </div>
              <p className="text-sm leading-relaxed text-charcoal-700">{r.text}</p>
              <p className="mt-2 text-xs text-charcoal-400">{r.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
