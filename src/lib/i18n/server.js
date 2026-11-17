import { headers, cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_HEADER, isLocale } from "./config";
import { dictionaries } from "./dictionary";

export async function getLocale() {
  try {
    const h = await headers();
    const fromHeader = h.get(LOCALE_HEADER);
    if (isLocale(fromHeader)) return fromHeader;
    const c = await cookies();
    const fromCookie = c.get(LOCALE_COOKIE)?.value;
    if (isLocale(fromCookie)) return fromCookie;
  } catch {
    /* static context */
  }
  return DEFAULT_LOCALE;
}

/** Server-component translator: `const { t, locale } = await getT();` */
export async function getT() {
  const locale = await getLocale();
  const get = (d, key) => key.split(".").reduce((o, k) => (o == null ? o : o[k]), d);
  const t = (key) => get(dictionaries[locale], key) ?? get(dictionaries[DEFAULT_LOCALE], key) ?? key;
  return { t, locale };
}
