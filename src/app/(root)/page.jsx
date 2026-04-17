import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import ServicesPinScroll from "@/components/home/ServicesPinScroll";
import TextRevealSection from "@/components/home/TextRevealSection";
import ProjectsShowcase from "@/components/home/ProjectsShowcase";
import StatsStrip from "@/components/home/StatsStrip";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import {
  getServices,
  getFeaturedProjects,
  getStats,
  getTestimonials,
} from "@/lib/supabase/queries";

export const revalidate = 3600;

export default async function HomePage() {
  const [services, projects, stats, testimonials] = await Promise.all([
    getServices(),
    getFeaturedProjects(),
    getStats(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero />
      <Marquee />
      <ServicesPinScroll services={services} />
      <TextRevealSection />
      <ProjectsShowcase projects={projects} />
      <StatsStrip stats={stats} />
      <Testimonials testimonials={testimonials} />
      <CTASection />
    </>
  );
}
