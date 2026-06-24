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
      <h1 className="font-display text-3xl text-charcoal">Your wishlist</h1>
      <p className="mt-2 text-charcoal/60">Whiskies you&apos;ve saved to come back to.</p>
      <div className="mt-8">
        <WishlistList allProducts={allProducts} />
      </div>
    </div>
  );
}
