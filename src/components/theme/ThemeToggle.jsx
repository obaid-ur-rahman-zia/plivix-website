"use client";

import { useTheme } from "./ThemeProvider";
import { Monitor, Sun, Moon } from "lucide-react";
import { useI18n } from "../I18nProvider";

const OPTIONS = [
  { key: "system", label: "System", Icon: Monitor },
  { key: "light", label: "Light", Icon: Sun },
  { key: "dark", label: "Dark", Icon: Moon },
];

export default function ThemeToggle({ variant = "segmented", forceDark = false }) {
  const { theme, setTheme, cycle, mounted } = useTheme();
  const { t } = useI18n();

  if (variant === "cycle") {
    const current = OPTIONS.find((o) => o.key === theme) || OPTIONS[0];
    const { Icon } = current;
    return (
      <button
        type="button"
        onClick={cycle}
        aria-label={`${t("theme.label")}: ${t(`theme.${current.key}`)}`}
        data-cursor="hover"
        suppressHydrationWarning
        className="relative w-10 h-10 flex items-center justify-center border rounded-full transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        style={{
          color: forceDark ? "#ffffff" : "var(--color-fg)",
          borderColor: forceDark
            ? "rgba(255,255,255,0.4)"
            : "var(--color-line-strong)",
        }}
      >
        <Icon className="w-4 h-4" strokeWidth={1.6} aria-hidden />
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label={t("theme.label")}
      suppressHydrationWarning
      className="inline-flex items-center gap-0 p-0.5 rounded-full border border-[var(--color-line-strong)] bg-[var(--color-bg-elev)]/40 backdrop-blur-sm"
    >
      {OPTIONS.map(({ key, Icon }) => {
        const active = mounted && theme === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={t(`theme.${key}`)}
            onClick={() => setTheme(key)}
            data-cursor="hover"
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              active
                ? "bg-[var(--color-fg)] text-[var(--color-bg)]"
                : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
            }`}
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={1.8} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
