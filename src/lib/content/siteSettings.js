/**
 * Fallback when Supabase has no row or is offline.
 * Shape matches `public.site_settings` + `getSiteSettings()` merge.
 */
export const defaultSiteSettings = {
  id: 1,
  contact_email: "hello@plivix-tech.com",
  address: "",
  location_tagline: "Remote · Global",
  hours: "Mon – Sat · 8:00 – 17:00 UTC+5",
  socials: {
    linkedin: "https://www.linkedin.com/company/plivix",
    instagram: "https://www.instagram.com/plivix.technologies/",
    x: "https://x.com/plivix_tech",
    upwork: "https://www.upwork.com/agencies/1814949357398654976/",
  },
};
