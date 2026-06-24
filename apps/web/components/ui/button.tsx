import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-whisky-600 text-cream hover:bg-whisky-700",
  secondary: "bg-charcoal text-cream hover:bg-charcoal/90",
  outline: "border border-whisky-600 text-whisky-700 hover:bg-whisky-50",
  ghost: "text-charcoal hover:bg-whisky-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

/** Shared button styling — also used to style `<Link>` elements as buttons. */
export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
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
