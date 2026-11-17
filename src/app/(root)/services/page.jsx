import { getServices } from "@/lib/supabase/queries";
import { getLocale } from "@/lib/i18n/server";
import { localizeRows, SERVICE_FIELDS } from "@/lib/i18n/localize";
import JsonLd, { breadcrumbs } from "@/components/JsonLd";
import ServicesPageClient from "@/components/services/ServicesPageClient";

export const revalidate = 3600;

export const metadata = {
  title: "Services — Plivix Technologies",
  description:
    "ERP systems, full-stack web, mobile apps, AI automation, machine learning and data science from Plivix Technologies.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const locale = await getLocale();
  const services = localizeRows(await getServices(), SERVICE_FIELDS, locale);
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([["Home", "/"], ["Services", "/services"]]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Plivix Technologies services",
            itemListElement: services.map((x, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Service",
                name: x.title,
                description: x.description || x.tagline,
                provider: { "@id": "https://www.plivix-tech.com/#org" },
                areaServed: "Worldwide",
              },
            })),
          },
        ]}
      />
      <ServicesPageClient services={services} />
    </>
  );
}
