import { NextResponse } from "next/server";
import {
  getServices,
  getAllProjects,
  getTeam,
  getTestimonials,
  getStats,
  getActiveInternships,
} from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const loaders = {
  services: getServices,
  projects: getAllProjects,
  team: getTeam,
  testimonials: getTestimonials,
  stats: getStats,
  internships: getActiveInternships,
};

export async function GET(_request, context) {
  const { entity } = await context.params;
  const loader = loaders[entity];
  if (!loader) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  }
  try {
    const data = await loader();
    return NextResponse.json(
      { data },
      {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}
