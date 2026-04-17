import { getServices } from "@/lib/supabase/queries";
import ServicesPageClient from "@/components/services/ServicesPageClient";

export const revalidate = 3600;

export const metadata = {
  title: "Services — Plivix Technologies",
  description:
    "Full-stack engineering, application development, AI automation, machine learning and data science from Plivix Technologies.",
};

export default async function ServicesPage() {
  const services = await getServices();
  return <ServicesPageClient services={services} />;
}
