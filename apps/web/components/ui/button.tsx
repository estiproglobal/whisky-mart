import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  // Cask amber on ink — warm, high-contrast, works on light or dark surfaces.
  primary: "bg-amber text-ink hover:bg-amber-dark",
  secondary: "bg-charcoal text-cream hover:bg-oak",
  outline: "border border-gold/50 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-cream",
  ghost: "text-charcoal hover:bg-parchment",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-[15px]",
};

/** Shared button styling — also used to style `<Link>` elements as buttons. */
export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium tracking-wide transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50",
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
