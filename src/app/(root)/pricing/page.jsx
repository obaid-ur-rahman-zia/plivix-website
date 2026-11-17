import PricingSection from "@/components/home/PricingSection";
import FaqSection from "@/components/home/FaqSection";
import CTASection from "@/components/home/CTASection";
import JsonLd, { breadcrumbs } from "@/components/JsonLd";
import IncludedList from "@/components/home/IncludedList";
import { getPricingPlans, getFaqs } from "@/lib/supabase/queries";
import { getLocale } from "@/lib/i18n/server";
import { localizeRows, PRICING_FIELDS, FAQ_FIELDS } from "@/lib/i18n/localize";

export const metadata = {
  title: "Software Pricing — Plivix Technologies",
  description:
    "Starting prices for websites, mobile apps, ERP systems and custom software. Written fixed-price quotes in USD or BDT.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const locale = await getLocale();
  const [plans, faqs] = await Promise.all([getPricingPlans(), getFaqs()]);
  const priced = plans.filter((p) => p.price_usd !== null && p.price_usd !== undefined && p.price_usd !== "");
  return (
    <div className="pt-20 md:pt-24">
      <JsonLd
        data={[
          breadcrumbs([["Home", "/"], ["Pricing", "/pricing"]]),
          ...priced.map((p) => ({
            "@context": "https://schema.org",
            "@type": "Service",
            name: p.name,
            description: p.tagline,
            provider: { "@id": "https://www.plivix-tech.com/#org" },
            offers: { "@type": "Offer", priceCurrency: "USD", price: String(p.price_usd), priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", minPrice: String(p.price_usd) } },
          })),
        ]}
      />
      <PricingSection full plans={localizeRows(plans, PRICING_FIELDS, locale)} />
      <IncludedList />
      <FaqSection faqs={localizeRows(faqs, FAQ_FIELDS, locale)} />
      <CTASection />
    </div>
  );
}
