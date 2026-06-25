import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  // Restrained luxe default: near-black on light surfaces.
  primary: "bg-charcoal text-cream hover:bg-oak",
  // Cask amber — reserved for dark surfaces (hero, ink panels) where it pops.
  accent: "bg-amber text-ink hover:bg-amber-dark",
  // Quiet parchment alternative.
  secondary: "bg-parchment text-charcoal hover:bg-whisky-100",
  outline: "border border-charcoal/25 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-cream",
  ghost: "text-charcoal hover:bg-parchment",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[11px]",
  md: "h-11 px-7 text-[12px]",
  lg: "h-[3.25rem] px-9 text-[12px]",
};

/** Shared button styling — also used to style `<Link>` elements as buttons. */
export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold uppercase tracking-[0.14em] transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button ref={ref} className={buttonClasses(variant, size, className)} {...props} />
  ),
);
Button.displayName = "Button";
