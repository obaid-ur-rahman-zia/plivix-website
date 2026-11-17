"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { dictionaries } from "@/lib/i18n/dictionary";
import { DEFAULT_LOCALE, LOCALE_COOKIE } from "@/lib/i18n/config";

const I18nContext = createContext({
  locale: DEFAULT_LOCALE,
  t: (k) => k,
  setLocale: () => {},
});

function lookup(dict, key) {
  return key.split(".").reduce((o, k) => (o == null ? o : o[k]), dict);
}

export function I18nProvider({ locale, children }) {
  const router = useRouter();
  const dict = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];

  const t = useCallback(
    (key) => {
      const v = lookup(dict, key);
      if (v !== undefined) return v;
      const fb = lookup(dictionaries[DEFAULT_LOCALE], key);
      return fb !== undefined ? fb : key;
    },
    [dict]
  );

  const setLocale = useCallback(
    (next) => {
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      router.refresh();
    },
    [router]
  );

  const value = useMemo(() => ({ locale, t, setLocale }), [locale, t, setLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

/** Pick `field_bn` from a CMS row when the visitor is on Bengali and it is filled in. */
export function pick(row, field, locale) {
  if (!row) return "";
  if (locale === "bn") {
    const v = row[`${field}_bn`];
    if (Array.isArray(v) ? v.length : v) return v;
  }
  return row[field];
}
