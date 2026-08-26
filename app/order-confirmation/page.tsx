"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, PartyPopper } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getProductsByIds } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { getOrder, type DemoOrder } from "@/lib/orders";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") ?? "";
  const [order, setOrder] = useState<DemoOrder | null | undefined>(undefined);

  useEffect(() => {
    setOrder(orderNumber ? getOrder(orderNumber) ?? null : null);
  }, [orderNumber]);

  if (order === undefined) return null;

  if (!order) {
    return (
      <Container className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="font-heading text-lg font-semibold text-charcoal-800">לא נמצאה הזמנה</p>
        <Button href="/shop" className="mt-2">מעבר לחנות</Button>
      </Container>
    );
  }

  const productMap = new Map(getProductsByIds(order.lines.map((l) => l.productId)).map((p) => [p.id, p]));

  return (
    <Container className="flex flex-col items-center gap-6 py-14 text-center sm:py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <CheckCircle2 size={32} />
      </div>
      <div>
        <h1 className="font-heading text-2xl font-semibold text-charcoal-900 sm:text-3xl">תודה, {order.customer.name}! ההזמנה נקלטה</h1>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-charcoal-500">
          <PartyPopper size={15} />
          מספר הזמנה: <span dir="ltr" className="font-semibold text-charcoal-800">{order.orderNumber}</span>
        </p>
      </div>

      <div className="w-full max-w-lg rounded-[var(--radius-card)] border border-sand-300 p-6 text-start">
        <ul className="flex flex-col gap-2 text-sm text-charcoal-700">
          {order.lines.map((line) => {
            const product = productMap.get(line.productId);
            if (!product) return null;
            return (
              <li key={line.id} className="flex justify-between">
                <span>{product.nameHe} × {line.quantity}</span>
                <span>{formatPrice(product.price * line.quantity)}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex justify-between border-t border-sand-200 pt-4 font-semibold text-charcoal-900">
          <span>סה&quot;כ</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="mt-4 border-t border-sand-200 pt-4 text-sm text-charcoal-500">
          <p>{order.deliveryOption}</p>
          <p>{order.customer.address}, {order.customer.city}</p>
        </div>
      </div>

      <p className="max-w-md text-sm text-charcoal-500">
        זהו אישור הזמנה לצורכי הדגמה. נציג מטעמנו ייצור עמכם קשר בטלפון {order.customer.phone} לתיאום המשך התהליך.
      </p>
      <Button href="/shop" size="lg">המשך בקניות</Button>
    </Container>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
