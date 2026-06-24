"use client";

import { Check, ShoppingBag } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-provider";

export function AddToCartButton({
  productId,
  variantId,
  label = "Add to basket",
  className,
}: {
  productId: string;
  variantId: string;
  label?: string;
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = React.useState(false);

  function onClick() {
    add({ productId, variantId, quantity: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <Button onClick={onClick} className={className} aria-live="polite">
      {added ? (
        <>
          <Check className="h-4 w-4" /> Added
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" /> {label}
        </>
      )}
    </Button>
  );
}
