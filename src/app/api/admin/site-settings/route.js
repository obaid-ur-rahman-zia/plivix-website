import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin, getSupabaseAdminConfigError } from "@/lib/supabase/adminServer";
import { defaultSiteSettings } from "@/lib/content/siteSettings";

export async function GET(request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cfgErr = getSupabaseAdminConfigError();
  if (cfgErr) return NextResponse.json({ error: cfgErr }, { status: 503 });
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Supabase admin unavailable" }, { status: 503 });

  const { data, error } = await admin.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) {
    const insert = {
      id: 1,
      contact_email: defaultSiteSettings.contact_email,
      address: defaultSiteSettings.address || null,
      location_tagline: defaultSiteSettings.location_tagline,
      hours: defaultSiteSettings.hours,
      socials: defaultSiteSettings.socials,
    };
    const { data: created, error: insErr } = await admin.from("site_settings").insert(insert).select().single();
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });
    return NextResponse.json({ data: created });
  }
  return NextResponse.json({ data });
}

export async function PATCH(request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cfgErr = getSupabaseAdminConfigError();
  if (cfgErr) return NextResponse.json({ error: cfgErr }, { status: 503 });
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Supabase admin unavailable" }, { status: 503 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch = { ...body };
  delete patch.id;
  patch.updated_at = new Date().toISOString();

  const { data, error } = await admin
    .from("site_settings")
    .upsert({ id: 1, ...patch }, { onConflict: "id" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/", "layout");
  return NextResponse.json({ data });
}
