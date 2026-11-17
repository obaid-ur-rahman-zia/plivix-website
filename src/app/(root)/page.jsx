import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import ServicesPinScroll from "@/components/home/ServicesPinScroll";
import SolutionsSection from "@/components/home/SolutionsSection";
import TextRevealSection from "@/components/home/TextRevealSection";
import ProcessSection from "@/components/home/ProcessSection";
import ProjectsShowcase from "@/components/home/ProjectsShowcase";
import StatsStrip from "@/components/home/StatsStrip";
import PricingSection from "@/components/home/PricingSection";
import Testimonials from "@/components/home/Testimonials";
import ProductsSection from "@/components/home/ProductsSection";
import FaqSection from "@/components/home/FaqSection";
import CTASection from "@/components/home/CTASection";
import {
  getServices,
  getFeaturedProjects,
  getStats,
  getTestimonials,
  getPricingPlans,
  getFaqs,
} from "@/lib/supabase/queries";
import { HOME_PROJECTS_LIMIT, HOME_SERVICES_LIMIT } from "@/lib/homePageLimits";
import { getLocale } from "@/lib/i18n/server";
import {
  localizeRows,
  SERVICE_FIELDS,
  PROJECT_FIELDS,
  TESTIMONIAL_FIELDS,
  PRICING_FIELDS,
  FAQ_FIELDS,
} from "@/lib/i18n/localize";

export default async function HomePage() {
  const locale = await getLocale();
  const [allServices, featuredProjects, stats, testimonials, plans, faqs] = await Promise.all([
    getServices(),
    getFeaturedProjects(),
    getStats(),
    getTestimonials(),
    getPricingPlans(),
    getFaqs(),
  ]);

  const services = localizeRows(allServices.slice(0, HOME_SERVICES_LIMIT), SERVICE_FIELDS, locale);
  const projects = localizeRows(featuredProjects.slice(0, HOME_PROJECTS_LIMIT), PROJECT_FIELDS, locale);

  return (
    <>
      <Hero />
      <Marquee />
      <ProductsSection />
      <SolutionsSection />
      <ServicesPinScroll services={services} />
      <TextRevealSection />
      <ProcessSection />
      <ProjectsShowcase projects={projects} />
      <StatsStrip stats={stats} />
      <PricingSection plans={localizeRows(plans, PRICING_FIELDS, locale)} />
      <Testimonials testimonials={localizeRows(testimonials, TESTIMONIAL_FIELDS, locale)} />
      <FaqSection faqs={localizeRows(faqs, FAQ_FIELDS, locale)} />
      <CTASection />
    </>
  );
}
