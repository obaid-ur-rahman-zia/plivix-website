import { getAllProjects } from "@/lib/supabase/queries";

const BASE = "https://www.plivix-tech.com";

export default async function sitemap() {
  const now = new Date();
  const pages = [
    ["", 1.0],
    ["/solutions", 0.9],
    ["/services", 0.9],
    ["/pricing", 0.9],
    ["/portfolio", 0.8],
    ["/about", 0.6],
    ["/contact", 0.8],
    ["/internships", 0.4],
    ["/privacy", 0.2],
    ["/terms", 0.2],
  ].map(([path, priority]) => ({ url: BASE + path, lastModified: now, changeFrequency: "weekly", priority }));

  let projects = [];
  try {
    projects = (await getAllProjects()).map((p) => ({
      url: `${BASE}/portfolio/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {}
  return [...pages, ...projects];
}
