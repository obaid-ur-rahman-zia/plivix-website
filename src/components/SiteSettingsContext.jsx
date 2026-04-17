"use client";

import { createContext, useContext } from "react";
import { defaultSiteSettings } from "@/lib/content/siteSettings";

const SiteSettingsContext = createContext(defaultSiteSettings);

export function SiteSettingsProvider({ value, children }) {
  return (
    <SiteSettingsContext.Provider value={value ?? defaultSiteSettings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
