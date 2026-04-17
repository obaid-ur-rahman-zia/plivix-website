"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeCtx = createContext(null);
const STORAGE_KEY = "plivix.theme";

function getSystemTheme() {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(resolved) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.style.colorScheme = resolved;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("system");
  const [resolved, setResolved] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    const next = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    setThemeState(next);
    const r = next === "system" ? getSystemTheme() : next;
    setResolved(r);
    applyTheme(r);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      const r = mql.matches ? "light" : "dark";
      setResolved(r);
      applyTheme(r);
    };
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [theme]);

  const setTheme = (next) => {
    setThemeState(next);
    const r = next === "system" ? getSystemTheme() : next;
    setResolved(r);
    applyTheme(r);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  const cycle = () => {
    const order = ["system", "light", "dark"];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  const value = useMemo(
    () => ({ theme, resolved, setTheme, cycle, mounted }),
    [theme, resolved, mounted]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) {
    // Safe fallback during SSR or when provider isn't mounted
    return { theme: "system", resolved: "dark", setTheme: () => {}, cycle: () => {}, mounted: false };
  }
  return ctx;
}
