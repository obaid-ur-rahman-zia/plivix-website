import ProductsSection from "@/components/home/ProductsSection";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";
import JsonLd, { breadcrumbs } from "@/components/JsonLd";

export const metadata = {
  title: "Products — Plivix ERP, POS, HR and Store",
  description:
    "Ready-made business software from Plivix Technologies: ERP, POS, HR & payroll and an online store, set up and customised for your company in weeks.",
  alternates: { canonical: "/products" },
};

const NAMES = ["Plivix ERP", "Plivix POS", "Plivix HR", "Plivix Store"];

export default function ProductsPage() {
  return (
    <div className="pt-20 md:pt-24">
      <JsonLd data={breadcrumbs([["Home", "/"], ["Products", "/products"]])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: NAMES.map((name, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "SoftwareApplication",
              name,
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              publisher: { "@type": "Organization", name: "Plivix Technologies" },
            },
          })),
        }}
      />
      <ProductsSection full />
      <ProcessSection />
      <CTASection />
    </div>
  );
}
