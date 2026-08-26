import type { SpecGroup } from "@/lib/types";

export function SpecTable({ groups }: { groups: SpecGroup[] }) {
  if (groups.length === 0) return null;
  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="mb-2 font-heading text-sm font-semibold text-charcoal-900">{group.title}</h3>
          <dl className="divide-y divide-sand-200 overflow-hidden rounded-[var(--radius-control)] border border-sand-200">
            {group.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 bg-white px-4 py-2.5 text-sm odd:bg-sand-50">
                <dt className="text-charcoal-500">{item.label}</dt>
                <dd className="font-medium text-charcoal-900">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
