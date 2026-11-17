"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "./I18nProvider";

/** Mobile-only bottom bar: one tap from a quote. Hidden on /contact and while the hero is on screen. */
export default function StickyCta() {
  const { t } = useI18n();
  const path = usePathname();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.7);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (path?.startsWith("/contact")) return null;
  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-[55] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-[var(--color-nav-bg)] backdrop-blur-xl border-t border-[var(--color-line)] transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Link
        href="/contact"
        className="flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] py-3.5 text-sm font-medium"
      >
        {t("sticky.talk")} <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
