/**
 * Downloads the atmosphere photography for "The Archive" (Increment 12B).
 *
 * The single source of truth is `lib/photo/manifest.ts`: each slot with a
 * `sourceUrl` is fetched from Unsplash's public download endpoint and written
 * to `public/photo/<id>.jpg`. Slots without a source are listed so a human can
 * curate them (the sandbox that built this increment had no image-CDN access;
 * see docs/12b-design-plan.md §4).
 *
 * Run from apps/web, with network access to unsplash.com:
 *   node scripts/fetch-photos.mjs
 *
 * After fetching: eyeball every image against its brief (they were curated by
 * description), re-run `pnpm build`, and update public/photo/CREDITS.md if you
 * swap any slot.
 */
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public", "photo");

/** Parse the slot() calls out of the TS manifest (id, brief, alt, sourceUrl?). */
function parseManifest() {
  const src = readFileSync(path.join(ROOT, "lib", "photo", "manifest.ts"), "utf8");
  const calls = [...src.matchAll(/slot\(\s*((?:"(?:[^"\\]|\\.)*"\s*,?\s*)+)\)/g)];
  return calls.map(([, args]) => {
    const strings = [...args.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
    const [id, brief, , sourceUrl] = strings;
    return { id, brief, sourceUrl: sourceUrl?.startsWith("http") ? sourceUrl : null };
  });
}

/** Unsplash photo page URL → its public download endpoint. */
function downloadUrl(pageUrl) {
  const slug = new URL(pageUrl).pathname.split("/").filter(Boolean).pop();
  return `https://unsplash.com/photos/${slug}/download?force=true&w=2400`;
}

const slots = parseManifest();
mkdirSync(OUT, { recursive: true });

let fetched = 0;
let failed = 0;
for (const { id, brief, sourceUrl } of slots) {
  const dest = path.join(OUT, `${id}.jpg`);
  if (existsSync(dest)) {
    console.log(`= ${id}: already present`);
    continue;
  }
  if (!sourceUrl) {
    console.log(`? ${id}: no source curated yet. Brief: ${brief}`);
    continue;
  }
  try {
    const res = await fetch(downloadUrl(sourceUrl), { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 20_000) throw new Error(`suspiciously small (${buf.length} bytes)`);
    writeFileSync(dest, buf);
    console.log(`+ ${id}: ${(buf.length / 1024).toFixed(0)} KiB from ${sourceUrl}`);
    fetched++;
  } catch (err) {
    console.error(`! ${id}: ${err.message} (${sourceUrl})`);
    failed++;
  }
}

console.log(`\nDone: ${fetched} fetched, ${failed} failed, ${slots.length} slots total.`);
if (failed > 0) process.exitCode = 1;
