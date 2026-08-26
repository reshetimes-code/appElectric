import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10", className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="mb-2 text-sm font-semibold tracking-wide text-brand-600">{eyebrow}</p>}
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-charcoal-900 sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-base leading-relaxed text-charcoal-500">{description}</p>}
    </div>
  );
}
