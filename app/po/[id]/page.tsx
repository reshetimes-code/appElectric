import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPurchaseOrderById } from "@/lib/server/purchaseOrders";
import { formatPrice } from "@/lib/utils";
import { PrintButton } from "@/components/po/PrintButton";
import { AutoPrint } from "@/components/po/AutoPrint";

export const metadata: Metadata = {
  title: "הזמנת רכש",
  robots: { index: false, follow: false },
};

/**
 * Public, unauthenticated document view of a purchase order — the link shared
 * with suppliers via WhatsApp/email. The PO id is a long random token (see
 * lib/utils#genId) so it doubles as an access key; there's no separate auth
 * gate here on purpose, the same way a shared invoice/quote link works.
 */
export default async function PurchaseOrderDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const po = await getPurchaseOrderById(id);
  if (!po) notFound();

  const total = po.costPrice * po.quantity;

  return (
    <>
      {/*
       * Print gets its own explicit rules instead of relying on Tailwind
       * screen utilities (min-h-screen, mx-auto) surviving @media print —
       * vh-based heights and auto-margins are notoriously unreliable once
       * Chrome switches to paginating a physical page, which is what was
       * clipping the document down to a corner of the printed/PDF page.
       */}
      <style>{`
        @media print {
          @page { margin: 14mm; }
          html, body { background: #fff !important; }
          #po-doc { max-width: none !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
        }
      `}</style>
      <div id="po-doc" className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8 sm:py-12">
        <AutoPrint />
        <div className="flex items-center justify-between gap-4 print:hidden">
          <Image src="/logo.png" alt="AppElectric" width={150} height={34} className="h-8 w-auto" priority />
          <PrintButton />
        </div>

        <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-6 sm:p-8 print:border-0 print:p-0">
          <div className="mb-5 hidden items-center justify-between border-b border-sand-200 pb-4 print:flex">
            <Image src="/logo.png" alt="AppElectric" width={150} height={34} className="h-8 w-auto" />
          </div>

          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-sand-200 pb-5">
            <div>
              <h1 dir="ltr" className="text-end font-heading text-2xl font-semibold text-charcoal-900">{po.poNumber}</h1>
              <p className="mt-1 text-sm text-charcoal-500">הזמנת רכש מ-AppElectric</p>
            </div>
            <p className="text-sm text-charcoal-400">נוצרה ב-{new Date(po.createdAt).toLocaleDateString("he-IL")}</p>
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-charcoal-400">ספק</dt>
              <dd className="text-sm font-medium text-charcoal-900">{po.supplierName}</dd>
            </div>
            <div>
              <dt className="text-xs text-charcoal-400">מוצר</dt>
              <dd className="text-sm font-medium text-charcoal-900">{po.productName}</dd>
            </div>
            <div>
              <dt className="text-xs text-charcoal-400">כמות</dt>
              <dd className="text-sm text-charcoal-900">{po.quantity}</dd>
            </div>
            <div>
              <dt className="text-xs text-charcoal-400">מחיר עלות ליחידה</dt>
              <dd className="text-sm text-charcoal-900">{formatPrice(po.costPrice)}</dd>
            </div>
            <div>
              <dt className="text-xs text-charcoal-400">סה&quot;כ לתשלום</dt>
              <dd className="text-base font-semibold text-charcoal-900">{formatPrice(total)}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-charcoal-400">כתובת להספקה</dt>
              <dd className="text-sm text-charcoal-900">{po.deliveryAddress}</dd>
            </div>
            {po.notes && (
              <div className="sm:col-span-2">
                <dt className="text-xs text-charcoal-400">הערות</dt>
                <dd className="text-sm text-charcoal-900">{po.notes}</dd>
              </div>
            )}
          </dl>

          <p className="mt-6 border-t border-sand-200 pt-4 text-sm text-charcoal-600">
            אנא אשרו קבלת הזמנה זו ומועד אספקה משוער בחזרה אלינו.
          </p>
        </div>

        <p className="text-center text-xs text-charcoal-400 print:hidden">AppElectric — מכשירי חשמל ומטבח פרימיום</p>
      </div>
    </>
  );
}
