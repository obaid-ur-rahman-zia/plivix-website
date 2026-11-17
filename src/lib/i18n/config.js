export const LOCALES = ["en", "bn"];
export const DEFAULT_LOCALE = "en";
export const LOCALE_COOKIE = "plx_lang";
export const LOCALE_HEADER = "x-plx-lang";

export function isLocale(v) {
  return LOCALES.includes(v);
}

/** Approximate USD→BDT used only for the "≈ ৳" hint next to USD prices. */
export const USD_TO_BDT = 120;
