import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { WishlistProvider } from "@/components/wishlist/wishlist-provider";
import { AccountProvider } from "@/components/account/account-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AgeGate } from "@/components/age-gate";

export const metadata: Metadata = {
  title: {
    default: "WhiskyMart — Discover, buy, collect & invest in whisky",
    template: "%s | WhiskyMart",
  },
  description:
    "The world's most trusted place to discover, buy, collect and invest in whisky and premium spirits.",
  metadataBase: new URL("https://www.whiskymart.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="flex min-h-screen flex-col">
        <AccountProvider>
          <CartProvider>
            <WishlistProvider>
              <AgeGate />
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </WishlistProvider>
          </CartProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
