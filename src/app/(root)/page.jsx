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
import { HOME_PROJECTS_LIMIT, HOME_SERVICES_LIMIT } from "@/lib/homePageLimits";

export const revalidate = 3600;

export default async function HomePage() {
  const [allServices, featuredProjects, stats, testimonials] = await Promise.all([
    getServices(),
    getFeaturedProjects(),
    getStats(),
    getTestimonials(),
  ]);

  const services = allServices.slice(0, HOME_SERVICES_LIMIT);
  const projects = featuredProjects.slice(0, HOME_PROJECTS_LIMIT);

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
