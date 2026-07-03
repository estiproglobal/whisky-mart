import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ink" | "outline-ink" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Buttons are Archivo, sentence case, 2px radius. Interaction feedback is
 * opacity only (the site's one orchestrated motion lives on the homepage
 * hero). `primary`/`outline`/`ghost` are for dark surfaces; `ink`/
 * `outline-ink` are for parchment.
 */
const variants: Record<Variant, string> = {
  primary: "bg-copper text-ink hover:opacity-90",
  outline: "border border-cream/30 text-cream hover:border-cream/70",
  ink: "bg-ink text-parchment hover:opacity-90",
  "outline-ink": "border border-ink/30 text-ink hover:border-ink/70",
  ghost: "text-cream hover:opacity-75",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4",
  md: "h-11 px-6",
  lg: "h-12 px-8",
};

/** Shared button styling: also used to style `<Link>` elements as buttons. */
export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded font-sans text-label font-medium transition-opacity duration-200 disabled:pointer-events-none disabled:opacity-50",
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
