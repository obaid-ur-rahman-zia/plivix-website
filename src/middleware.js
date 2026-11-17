import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_HEADER, isLocale } from "@/lib/i18n/config";

/**
 * First visit: Bangladesh (by edge geo header) or a Bengali browser → "bn",
 * everyone else → "en". The choice is stored in a cookie so the visitor can
 * switch language and we never override their pick.
 */
export function middleware(request) {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  let locale = isLocale(saved) ? saved : null;
  const fresh = !locale;

  if (!locale) {
    const country = (
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      ""
    ).toUpperCase();
    const accept = (request.headers.get("accept-language") || "").toLowerCase();
    const prefersBn = /(^|,)\s*bn\b/.test(accept);
    locale = country === "BD" || (!country && prefersBn) ? "bn" : DEFAULT_LOCALE;
  }

  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale);
  const res = NextResponse.next({ request: { headers } });
  if (fresh) {
    res.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  return res;
}

export const config = {
  matcher: ["/((?!api|_next|plivix-manage|.*\..*).*)"],
};
