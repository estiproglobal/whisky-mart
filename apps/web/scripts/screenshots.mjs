// WhiskyMart — capture screenshots of the key journeys.
//
// Usage (browsers available locally, unlike the sandbox):
//   1) Run the app:
//        pnpm install
//        pnpm --filter @whiskymart/web build
//        pnpm --filter @whiskymart/web start      # http://localhost:3000
//   2) In another terminal:
//        npm i -D playwright && npx playwright install chromium
//        BASE_URL=http://localhost:3000 node screenshots.mjs
//   PNGs are written to ./screenshots/
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = "screenshots";
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });

// Seed localStorage before any page loads: bypass the age gate, pre-fill a
// basket (so cart/checkout have contents) and a mock account.
await ctx.addInitScript(() => {
  localStorage.setItem("wm_age_ok", "1");
  localStorage.setItem(
    "wm_cart",
    JSON.stringify([
      { productId: "p_lagavulin16", variantId: "v_lag16_70", quantity: 1 },
      { productId: "p_glencairn_glass", variantId: "v_glencairn_2", quantity: 1 },
    ]),
  );
  localStorage.setItem("wm_account", JSON.stringify({ name: "Ada Tester", email: "ada@example.com" }));
});

const page = await ctx.newPage();

async function shot(path, file, prep) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  if (prep) {
    try {
      await prep();
    } catch (e) {
      console.warn(`prep for ${file} failed:`, e.message);
    }
  }
  await page.screenshot({ path: `${OUT}/${file}.png`, fullPage: true });
  console.log("saved", `${file}.png`);
}

await shot("/", "01-home");
await shot("/shop", "02-shop-plp");
await shot("/c/islay", "03-category-islay");
await shot("/products/lagavulin-16-year-old", "04-pdp");

await shot("/sommelier", "05-sommelier", async () => {
  await page.getByRole("button", { name: "A peated whisky for a beginner" }).click();
  await page.waitForResponse((r) => r.url().includes("/api/advisor"));
  await page.waitForTimeout(600);
});

await shot("/gift-finder", "06-gift-finder", async () => {
  await page.getByRole("button", { name: "Sweet" }).click();
  await page.getByRole("button", { name: /Find gifts/ }).click();
  await page.waitForResponse((r) => r.url().includes("/api/gift-finder"));
  await page.waitForTimeout(600);
});

await shot("/cart", "07-cart");
await shot("/checkout", "08-checkout", async () => {
  await page.waitForResponse((r) => r.url().includes("/api/checkout/quote")).catch(() => {});
  await page.waitForTimeout(600);
});
await shot("/guides", "09-guides");
await shot("/guides/best-whisky-under-50", "10-guide-article");
await shot("/account", "11-account");
await shot("/account/wishlist", "12-wishlist");

await browser.close();
console.log(`\nDone — see ./${OUT}/`);
