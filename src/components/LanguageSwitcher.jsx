"use client";

import { useI18n } from "./I18nProvider";

export default function LanguageSwitcher({ className = "" }) {
  const { locale, setLocale } = useI18n();
  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex items-center rounded-full border border-[var(--color-line-strong)] p-0.5 text-xs ${className}`}
    >
      {[
        ["en", "EN"],
        ["bn", "বাং"],
      ].map(([code, label]) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={locale === code}
          onClick={() => locale !== code && setLocale(code)}
          data-cursor="hover"
          className={`min-w-[2.25rem] rounded-full px-2.5 py-1.5 font-medium transition-colors ${
            locale === code
              ? "bg-[var(--color-accent)] text-[var(--color-on-accent)]"
              : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
