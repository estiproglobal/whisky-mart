import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { WishlistProvider } from "@/components/wishlist/wishlist-provider";
import { AccountProvider } from "@/components/account/account-provider";
import { CurrencyProvider } from "@/components/market/currency-provider";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { PalateProvider } from "@/components/personalization/palate-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AgeGate } from "@/components/age-gate";

const displaySerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const bodySans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

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
    <html lang="en-GB" className={`${displaySerif.variable} ${bodySans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <LocaleProvider>
          <CurrencyProvider>
            <AccountProvider>
              <PalateProvider>
                <CartProvider>
                  <WishlistProvider>
                    <AgeGate />
                    <SiteHeader />
                    <main className="flex-1">{children}</main>
                    <SiteFooter />
                  </WishlistProvider>
                </CartProvider>
              </PalateProvider>
            </AccountProvider>
          </CurrencyProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
