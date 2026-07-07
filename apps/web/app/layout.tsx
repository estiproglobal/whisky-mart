import type { Metadata } from "next";
import { Archivo, Libre_Caslon_Display, Newsreader } from "next/font/google";
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

const displaySerif = Libre_Caslon_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const bodySerif = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-body",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const utilitySans = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "WhiskyMart: single malts, chosen slowly",
    template: "%s | WhiskyMart",
  },
  description:
    "A short shelf of single malts and tasting flights, described honestly. Ask the Sommelier before you spend.",
  metadataBase: new URL("https://www.whiskymart.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${displaySerif.variable} ${bodySerif.variable} ${utilitySans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Pre-paint check so verified visitors never see the age gate flash
            (the gate itself ships in the server HTML for LCP; see
            components/age-gate.tsx). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(localStorage.getItem("wm_age_ok")==="1")document.documentElement.setAttribute("data-age-ok","1")}catch(e){}',
          }}
        />
      </head>
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
