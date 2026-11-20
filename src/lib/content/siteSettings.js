/**
 * Fallback when Supabase has no row or is offline.
 * Shape matches `public.site_settings` + `getSiteSettings()` merge.
 */
export const defaultSiteSettings = {
  id: 1,
  contact_email: "contact@plivix-tech.com",
  address: "",
  location_tagline: "" /* empty = bilingual default from i18n */,
  hours: "",
  phone_bd: "+880 1641 682637",
  phone_pk: "+92 370 6014905",
  socials: {
    linkedin: "https://www.linkedin.com/company/plivix",
    instagram: "https://www.instagram.com/plivix.technologies/",
    x: "https://x.com/plivix_tech",
    upwork: "https://www.upwork.com/agencies/1814949357398654976/",
  },
};
