"use client";

import { useEffect } from "react";
import { useLoading } from "./LoadingContext";

/**
 * Drives the intro loader. The page is already server-rendered with its
 * data, so we only wait for web fonts (to avoid a layout jump), capped at
 * 1.2s. We no longer wait for every image or re-fetch content from the API:
 * that made the first load several seconds slower for no visible benefit.
 */
export default function LoadingMonitor() {
  const { markDataReady, markFontsReady, markAssetsReady } = useLoading();

  useEffect(() => {
    markDataReady();
    markAssetsReady();
    const done = () => markFontsReady();
    if (document.fonts?.ready) document.fonts.ready.then(done, done);
    else done();
    const cap = window.setTimeout(done, 1200);
    return () => window.clearTimeout(cap);
  }, [markDataReady, markFontsReady, markAssetsReady]);

  return null;
}
