"use client";

import { useEffect } from "react";
import { useLoading } from "./LoadingContext";
import { fetchContent } from "@/lib/supabase/queries";

/**
 * Drives the three loading gates:
 *   - fontsReady from document.fonts.ready
 *   - assetsReady from window load + <img>/<video> progress
 *   - dataReady from parallel fetches of the content entities the home
 *     page consumes
 *
 * Runs once per app load.
 */
export default function LoadingMonitor() {
  const {
    markDataReady,
    markFontsReady,
    markAssetsReady,
    setAssetsProgress,
    setDataProgress,
  } = useLoading();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // -------------------- Fonts --------------------
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => markFontsReady()).catch(() => markFontsReady());
    } else {
      markFontsReady();
    }

    // -------------------- Data ---------------------
    const entities = ["services", "projects", "testimonials", "stats"];
    let doneEntities = 0;
    Promise.all(
      entities.map((e) =>
        fetchContent(e)
          .catch(() => null)
          .finally(() => {
            doneEntities += 1;
            setDataProgress(Math.min(1, doneEntities / entities.length));
          })
      )
    ).then(() => markDataReady());

    // -------------------- Assets -------------------
    const finishAssets = () => {
      const images = Array.from(document.querySelectorAll("img"));
      if (images.length === 0) {
        markAssetsReady();
        return;
      }
      let done = 0;
      const update = () => {
        done += 1;
        setAssetsProgress(Math.min(1, done / images.length));
        if (done >= images.length) markAssetsReady();
      };
      images.forEach((img) => {
        if (img.complete) {
          update();
        } else {
          img.addEventListener("load", update, { once: true });
          img.addEventListener("error", update, { once: true });
        }
      });
    };

    if (document.readyState === "complete") {
      finishAssets();
    } else {
      window.addEventListener("load", finishAssets, { once: true });
    }

    // Hard safety timeout — don't hang the loader longer than 4s even
    // if a stray resource never resolves.
    const safety = window.setTimeout(() => {
      markFontsReady();
      markDataReady();
      markAssetsReady();
    }, 4000);

    return () => window.clearTimeout(safety);
  }, [markDataReady, markFontsReady, markAssetsReady, setAssetsProgress, setDataProgress]);

  return null;
}
