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

  const total = po.items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);

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
          </dl>

          <table className="mt-5 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-sand-300 text-start text-xs text-charcoal-400">
                <th className="pb-2 text-start font-normal">מוצר</th>
                <th className="pb-2 text-start font-normal">כמות</th>
                <th className="pb-2 text-start font-normal">מחיר ליחידה</th>
                <th className="pb-2 text-start font-normal">סה&quot;כ</th>
              </tr>
            </thead>
            <tbody>
              {po.items.map((item, i) => (
                <tr key={i} className="border-b border-sand-200">
                  <td className="py-2 pe-2 font-medium text-charcoal-900">{item.productName}</td>
                  <td className="py-2 pe-2 text-charcoal-700">{item.quantity}</td>
                  <td className="py-2 pe-2 text-charcoal-700">{formatPrice(item.costPrice)}</td>
                  <td className="py-2 text-charcoal-700">{formatPrice(item.costPrice * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="pt-3 text-end text-sm font-semibold text-charcoal-900">סה&quot;כ לתשלום</td>
                <td className="pt-3 text-base font-semibold text-charcoal-900">{formatPrice(total)}</td>
              </tr>
            </tfoot>
          </table>

          <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
