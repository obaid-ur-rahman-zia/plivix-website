"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

/**
 * Three-gate loading model:
 *   - dataReady   : the async content (services / projects / team) is fetched
 *   - fontsReady  : document.fonts.ready has resolved
 *   - assetsReady : critical images and videos in the DOM have finished
 * Progress is a weighted blend that makes the counter climb smoothly
 * even before individual gates flip.
 */

const WEIGHTS = { data: 0.45, fonts: 0.2, assets: 0.35 };

const defaultValue = {
  progress: 0,
  isComplete: false,
  dataReady: false,
  fontsReady: false,
  assetsReady: false,
  markDataReady: () => {},
  markFontsReady: () => {},
  markAssetsReady: () => {},
  setAssetsProgress: () => {},
  setDataProgress: () => {},
};

export const LoadingContext = createContext(defaultValue);

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }) {
  const [dataProgress, setDataProgress] = useState(0);
  const [fontsProgress, setFontsProgress] = useState(0);
  const [assetsProgress, setAssetsProgress] = useState(0);

  const markDataReady = useCallback(() => setDataProgress(1), []);
  const markFontsReady = useCallback(() => setFontsProgress(1), []);
  const markAssetsReady = useCallback(() => setAssetsProgress(1), []);

  const rawProgress = useMemo(() => {
    return (
      WEIGHTS.data * dataProgress +
      WEIGHTS.fonts * fontsProgress +
      WEIGHTS.assets * assetsProgress
    );
  }, [dataProgress, fontsProgress, assetsProgress]);

  // Smooth progress so the counter eases up instead of snapping.
  const [smooth, setSmooth] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => {
      setSmooth((prev) => {
        const target = rawProgress;
        const next = prev + (target - prev) * 0.08;
        if (Math.abs(target - next) < 0.001) return target;
        raf = requestAnimationFrame(tick);
        return next;
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rawProgress]);

  const progress = Math.round(smooth * 100);
  const isComplete = rawProgress >= 0.999;

  const value = useMemo(
    () => ({
      progress,
      isComplete,
      dataReady: dataProgress === 1,
      fontsReady: fontsProgress === 1,
      assetsReady: assetsProgress === 1,
      markDataReady,
      markFontsReady,
      markAssetsReady,
      setDataProgress,
      setAssetsProgress,
    }),
    [
      progress,
      isComplete,
      dataProgress,
      fontsProgress,
      assetsProgress,
      markDataReady,
      markFontsReady,
      markAssetsReady,
    ]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}
