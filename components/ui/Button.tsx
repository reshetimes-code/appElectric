import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "outline-light";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
  secondary: "bg-white text-charcoal-900 border border-sand-300 hover:border-charcoal-400",
  ghost: "bg-transparent text-charcoal-800 hover:bg-sand-200",
  dark: "bg-charcoal-900 text-white hover:bg-charcoal-800",
  "outline-light": "bg-transparent text-white border border-white/50 hover:bg-white/10",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  fullWidth?: boolean;
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkButtonProps = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

export function Button(props: ButtonProps | LinkButtonProps) {
  const { variant = "primary", size = "md", className, children, fullWidth, ...rest } = props;
  const classes = cn(
    "inline-flex items-center justify-center rounded-[var(--radius-control)] font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && "w-full",
    className,
  );

  if ("href" in props && props.href) {
    const { href, target, rel } = rest as LinkButtonProps;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
