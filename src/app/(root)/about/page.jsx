import AboutPage from "@/components/AboutPage";
import GlanceSection from "@/components/home/GlanceSection";
import { getLocale } from "@/lib/i18n/server";
import { localizeRows, TEAM_FIELDS } from "@/lib/i18n/localize";
import { getTeam, getStats } from "@/lib/supabase/queries";

export const revalidate = 3600;

export const metadata = {
  title: "About — Plivix Technologies",
  description:
    "Plivix = PLI (Progress, Logic & Innovation) + VIX (Vision, Intelligence & X). A Bangladesh software company building ERP, management systems and apps.",
  openGraph: {
    title: "About — Plivix Technologies",
    description:
      "Plivix = PLI (Progress, Logic & Innovation) + VIX (Vision, Intelligence & X). A Bangladesh software company building ERP, management systems and apps.",
    url: "https://www.plivix-tech.com/about",
  },
  alternates: { canonical: "https://www.plivix-tech.com/about" },
};

export default async function About() {
  const [rows, stats, locale] = await Promise.all([getTeam(), getStats(), getLocale()]);
  const team = localizeRows(rows, TEAM_FIELDS, locale);
  return <AboutPage team={team} stats={stats} beforeCta={<GlanceSection />} />;
}
