"use client";

import Image from "next/image";
import { useTheme } from "./theme/ThemeProvider";

/**
 * Themed Plivix logo.
 * variant="mark" -> icon-only logo (logo-dark-theme.png / logo-light-theme.png)
 * variant="full" -> full horizontal wordmark (logo-full-dark-theme.png / logo-full-light-theme.png)
 *
 * "dark-theme" assets are used on a DARK background (so they're light-colored),
 * "light-theme" assets are used on a LIGHT background (so they're dark-colored).
 */
export default function Logo({
  variant = "mark",
  className = "",
  width = 120,
  height = 36,
  priority = false,
  alt = "Plivix",
  /**
   * Force the logo to render as if a specific theme were active, regardless
   * of the site theme. Useful when the logo sits over a dark stage (the hero)
   * while the rest of the page is in light mode.
   */
  forceTheme,
}) {
  const { resolved, mounted } = useTheme();
  const effective = forceTheme ?? (mounted ? resolved : "dark");
  const useLight = effective === "light";

  const src =
    variant === "full"
      ? useLight
        ? "/images/logo/logo-full-light-theme.png"
        : "/images/logo/logo-full-dark-theme.png"
      : useLight
      ? "/images/logo/logo-light-theme.png"
      : "/images/logo/logo-dark-theme.png";

  return (
    <Image
      key={src}
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={`${width}px`}
      className={className}
    />
  );
}
