import AboutPage from "@/components/AboutPage";
import GlanceSection from "@/components/home/GlanceSection";
import { getTeam, getStats } from "@/lib/supabase/queries";

export const revalidate = 3600;

export const metadata = {
  title: "About — Plivix Technologies",
  description:
    "A small, senior engineering team shipping production web, mobile, AI and data platforms.",
  openGraph: {
    title: "About — Plivix Technologies",
    description:
      "A small, senior engineering team shipping production web, mobile, AI and data platforms.",
    url: "https://www.plivix-tech.com/about",
  },
  alternates: { canonical: "https://www.plivix-tech.com/about" },
};

export default async function About() {
  const [team, stats] = await Promise.all([getTeam(), getStats()]);
  return <AboutPage team={team} stats={stats} beforeCta={<GlanceSection />} />;
}
