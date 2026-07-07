import fs from "node:fs";
import path from "node:path";
import { getSlot, PHOTO_SLOTS, type PhotoSlot } from "./manifest";

/**
 * Server-side photo lookup with graceful degradation: a slot resolves only
 * when its binary exists in `public/photo/`, so the site renders its tonal
 * fallbacks until `scripts/fetch-photos.mjs` has run. Import from server
 * components only (uses `fs`). Resolution happens at build time for SSG
 * pages, which is exactly when the binaries would be present.
 */

export interface ResolvedPhoto {
  src: string;
  alt: string;
}

const PHOTO_DIR = path.join(process.cwd(), "public", "photo");

function fileFor(id: string): string | null {
  for (const ext of ["avif", "webp", "jpg", "jpeg"]) {
    const file = `${id}.${ext}`;
    if (fs.existsSync(path.join(PHOTO_DIR, file))) return file;
  }
  return null;
}

/** The slot's image if its binary is on disk, else null (caller falls back). */
export function getPhoto(id: string): ResolvedPhoto | null {
  const slot = getSlot(id);
  if (!slot) return null;
  const file = fileFor(id);
  if (!file) return null;
  return { src: `/photo/${file}`, alt: slot.alt };
}

export { PHOTO_SLOTS, type PhotoSlot };
