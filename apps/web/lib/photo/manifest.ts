/**
 * The atmosphere photography manifest: every photographic slot on the site,
 * its shot brief, and (once curated) its source and licence. The binaries
 * live in `apps/web/public/photo/` and are fetched by
 * `scripts/fetch-photos.mjs`; sources and licences are mirrored in
 * `public/photo/CREDITS.md`.
 *
 * The sandbox this increment was built in could not reach the image CDNs,
 * so pages degrade gracefully: `getPhoto()` (see ./index.ts) returns null
 * until a slot's file exists on disk, and callers fall back to the tonal
 * ground. Run `node scripts/fetch-photos.mjs` (network permitting) to fill
 * `public/photo/`.
 */

export interface PhotoSlot {
  /** Slot id; the binary is `public/photo/<id>.jpg`. */
  id: string;
  /** What the shot must be (the art direction brief). */
  brief: string;
  /** Alt text used wherever the slot renders. */
  alt: string;
  /** Photo page on the source site (Unsplash/Pexels), once curated. */
  sourceUrl: string | null;
  /** Photographer credit, once curated. */
  photographer: string | null;
  /** Licence name (Unsplash License / Pexels License). */
  license: string | null;
}

const slot = (
  id: string,
  brief: string,
  alt: string,
  sourceUrl: string | null = null,
  photographer: string | null = null,
  license: string | null = null,
): PhotoSlot => ({ id, brief, alt, sourceUrl, photographer, license });

export const PHOTO_SLOTS: PhotoSlot[] = [
  slot(
    "hero-dram",
    "A dram glass in low warm light, dark surroundings, room to the left for the headline.",
    "A glass of whisky on a dark wooden table in low warm light",
    "https://unsplash.com/photos/a-glass-of-whiskey-sitting-on-top-of-a-wooden-table-vt1HMqYxSuU",
    "Karolina Grabowska",
    "Unsplash License",
  ),
  slot(
    "casks",
    "Oak casks stacked in a dark warehouse, warm side light.",
    "Oak whisky casks stacked in a dark warehouse",
    "https://unsplash.com/photos/k_mLEqWmZug",
    "André Carvalho",
    "Unsplash License",
  ),
  slot(
    "still",
    "Copper pot-still detail, warm reflections.",
    "Detail of a copper whisky still",
  ),
  slot(
    "islay-coast",
    "A peaty, coastal island landscape under heavy sky.",
    "A rocky island coastline under a heavy sky",
  ),
  slot(
    "pour",
    "A pour close-up: whisky falling into a glass.",
    "Whisky being poured into a glass, close up",
    "https://unsplash.com/photos/a-person-pouring-a-liquid-into-a-glass-dCg2EpvbkzY",
    "SJ",
    "Unsplash License",
  ),
  slot(
    "shelf",
    "Bottles on dark shelving, labels illegible.",
    "Whisky bottles on dark shelving, labels out of focus",
    "https://unsplash.com/photos/a-blurry-photo-of-a-bar-with-bottles-on-the-shelves-QFJuhlfgHwc",
    "Panos Katsigiannis",
    "Unsplash License",
  ),
  slot(
    "tasting-table",
    "A tasting table: several glasses, warm light, people optional.",
    "Glasses set out on a table for a whisky tasting",
    "https://unsplash.com/photos/a-glass-of-whiskey-and-nuts-on-a-table-iZ7iji2voN4",
    "Natalie Behn",
    "Unsplash License",
  ),
  slot(
    "cork",
    "Cork-and-capsule macro, shallow depth of field.",
    "Close-up of a whisky bottle cork and capsule",
    "https://unsplash.com/photos/a-bottle-of-whiskey-next-to-a-glass-on-a-wooden-table-0c4vcpyhEWs",
    "Brett Jordan",
    "Unsplash License",
  ),
  slot(
    "barley",
    "Malted barley or a barley field, muted tones (guide covers).",
    "Barley in muted light",
    "https://unsplash.com/photos/a-field-of-wheat-with-birds-flying-stIVDzkkBfE",
    "Unsplash contributor (verify on fetch)",
    "Unsplash License",
  ),
  slot(
    "glass-pair",
    "Two glasses on a dark table (gift/tasting contexts).",
    "Two glasses of whisky on a dark table",
    "https://unsplash.com/photos/two-glasses-of-whiskey-on-a-wooden-table-9qcAjKIQ6Zg",
    "Monika Grabkowska",
    "Unsplash License",
  ),
];

export function getSlot(id: string): PhotoSlot | undefined {
  return PHOTO_SLOTS.find((s) => s.id === id);
}
