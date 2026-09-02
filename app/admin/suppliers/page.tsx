import { getSuppliers } from "@/lib/server/suppliers";
import { SupplierForm } from "@/components/admin/SupplierForm";
import { DeleteSupplierButton } from "@/components/admin/DeleteSupplierButton";
import { Truck } from "lucide-react";

export default async function AdminSuppliersPage() {
  const suppliers = getSuppliers();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-charcoal-900">ספקים</h1>
        <p className="mt-1 text-sm text-charcoal-500">רשימת הספקים שלך — משמשת ליצירת הזמנות רכש.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          {suppliers.length === 0 ? (
            <div className="rounded-[var(--radius-card)] border border-dashed border-sand-300 p-8 text-center text-sm text-charcoal-500">
              <Truck size={24} className="mx-auto mb-2 text-charcoal-300" />
              עדיין לא הוספת ספקים.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-white">
              {suppliers.map((s) => (
                <div key={s.id} className="flex items-center gap-4 border-b border-sand-200 p-4 last:border-none">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-charcoal-900">{s.name}</p>
                    <p dir="ltr" className="text-end text-xs text-charcoal-500">{s.email} · {s.whatsapp}</p>
                  </div>
                  <DeleteSupplierButton id={s.id} />
                </div>
              ))}
            </div>
          )}
        </div>
        <SupplierForm />
      </div>
    </div>
  );
}
