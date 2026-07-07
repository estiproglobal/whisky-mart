import type { Metadata } from "next";
import { catalog } from "@/lib/catalog/repository";
import { WishlistList } from "@/components/wishlist/wishlist-list";

export const metadata: Metadata = {
  title: "Your wishlist",
};

export default async function WishlistPage() {
  const allProducts = await catalog.getAll();
  return (
    <div className="container-page py-10">
      <h1 className="font-display text-d2 text-cream">Your wishlist</h1>
      <p className="mt-2 text-body-sm text-cream-muted">Whiskies you&apos;ve saved to come back to.</p>
      <div className="mt-8">
        <WishlistList allProducts={allProducts} />
      </div>
    </div>
  );
}
