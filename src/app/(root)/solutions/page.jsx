import SolutionsSection from "@/components/home/SolutionsSection";
import JsonLd, { breadcrumbs } from "@/components/JsonLd";
import FaqSection from "@/components/home/FaqSection";
import CTASection from "@/components/home/CTASection";
import { getFaqs } from "@/lib/supabase/queries";
import { getLocale } from "@/lib/i18n/server";
import { localizeRows, FAQ_FIELDS } from "@/lib/i18n/localize";

export const metadata = {
  title: "ERP & Business Software — Plivix Technologies",
  description:
    "Custom ERP, CRM, HR, inventory and POS systems for companies in Bangladesh and worldwide. Bangla and English, fixed-price proposals.",
  alternates: { canonical: "/solutions" },
};

export default async function SolutionsPage() {
  const locale = await getLocale();
  const faqs = localizeRows(await getFaqs(), FAQ_FIELDS, locale);
  return (
    <div className="pt-20 md:pt-24">
      <JsonLd data={breadcrumbs([["Home", "/"], ["ERP & Solutions", "/solutions"]])} />
      <SolutionsSection full />
      <FaqSection faqs={faqs} />
      <CTASection />
    </div>
  );
}
