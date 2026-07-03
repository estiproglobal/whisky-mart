/**
 * UI message catalogue (Phase 2: i18n). Interface-first: messages live here
 * today; a TMS / CMS-backed source and locale-routed URLs (for hreflang SEO)
 * are the production follow-up (see DEFERRED.md).
 *
 * Proper nouns (Islay, Speyside, WhiskyMart) are intentionally not translated.
 */

export type Locale = "en" | "de" | "fr";

export interface LocaleMeta {
  code: Locale;
  label: string;
  htmlLang: string;
}

export const SUPPORTED_LOCALES: LocaleMeta[] = [
  { code: "en", label: "English", htmlLang: "en-GB" },
  { code: "de", label: "Deutsch", htmlLang: "de-DE" },
  { code: "fr", label: "Français", htmlLang: "fr-FR" },
];

export type Messages = Record<string, string>;

const en: Messages = {
  "nav.whisky": "Whisky",
  "nav.islay": "Islay",
  "nav.speyside": "Speyside",
  "nav.bestSellers": "Best sellers",
  "nav.samples": "Samples",
  "nav.guides": "Guides",
  "nav.giftFinder": "Gift Finder",
  "header.account": "Account",
  "header.wishlist": "Wishlist",
  "header.basket": "Basket",
  "footer.tagline": "A short shelf of single malts, described honestly and sold properly.",
  "footer.shop": "Shop",
  "footer.explore": "Regions",
  "footer.responsibly": "Please drink responsibly.",
  "footer.ageNotice": "You must be 18 or over to purchase alcohol.",
  "footer.colophon": "WhiskyMart is currently a demonstration storefront. Payments and fulfilment are simulated.",
  "ageGate.question": "Are you of legal drinking age?",
  "ageGate.subtitle": "You must be 18 or over to enter. Please drink responsibly.",
  "ageGate.yes": "Yes, I am 18+",
  "ageGate.no": "No",
  "ageGate.denied": "Sorry, you must be of legal drinking age to use this site.",
};

const de: Messages = {
  "nav.whisky": "Whisky",
  "nav.islay": "Islay",
  "nav.speyside": "Speyside",
  "nav.bestSellers": "Bestseller",
  "nav.samples": "Proben",
  "nav.guides": "Ratgeber",
  "nav.giftFinder": "Geschenkfinder",
  "header.account": "Konto",
  "header.wishlist": "Wunschliste",
  "header.basket": "Warenkorb",
  "footer.tagline": "Ein kurzes Regal an Single Malts, ehrlich beschrieben und ordentlich verkauft.",
  "footer.shop": "Shop",
  "footer.explore": "Regionen",
  "footer.responsibly": "Bitte trinken Sie verantwortungsbewusst.",
  "footer.ageNotice": "Sie müssen mindestens 18 Jahre alt sein, um Alkohol zu kaufen.",
  "footer.colophon": "WhiskyMart ist derzeit ein Demo-Storefront. Zahlungen und Versand werden simuliert.",
  "ageGate.question": "Haben Sie das gesetzliche Mindestalter zum Trinken?",
  "ageGate.subtitle":
    "Sie müssen mindestens 18 Jahre alt sein, um einzutreten. Bitte trinken Sie verantwortungsbewusst.",
  "ageGate.yes": "Ja, ich bin 18+",
  "ageGate.no": "Nein",
  "ageGate.denied": "Entschuldigung, Sie müssen volljährig sein, um diese Seite zu nutzen.",
};

const fr: Messages = {
  "nav.whisky": "Whisky",
  "nav.islay": "Islay",
  "nav.speyside": "Speyside",
  "nav.bestSellers": "Meilleures ventes",
  "nav.samples": "Échantillons",
  "nav.guides": "Guides",
  "nav.giftFinder": "Idées cadeaux",
  "header.account": "Compte",
  "header.wishlist": "Liste de souhaits",
  "header.basket": "Panier",
  "footer.tagline": "Une courte étagère de single malts, décrits honnêtement et vendus comme il se doit.",
  "footer.shop": "Boutique",
  "footer.explore": "Régions",
  "footer.responsibly": "À consommer avec modération.",
  "footer.ageNotice": "Vous devez avoir 18 ans ou plus pour acheter de l'alcool.",
  "footer.colophon": "WhiskyMart est actuellement une boutique de démonstration. Les paiements et l'expédition sont simulés.",
  "ageGate.question": "Avez-vous l'âge légal pour boire ?",
  "ageGate.subtitle": "Vous devez avoir 18 ans ou plus pour entrer. À consommer avec modération.",
  "ageGate.yes": "Oui, j'ai 18 ans ou plus",
  "ageGate.no": "Non",
  "ageGate.denied": "Désolé, vous devez avoir l'âge légal pour utiliser ce site.",
};

export const MESSAGES: Record<Locale, Messages> = { en, de, fr };
