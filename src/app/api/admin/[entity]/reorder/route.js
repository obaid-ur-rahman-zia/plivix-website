import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin, getSupabaseAdminConfigError } from "@/lib/supabase/adminServer";
import { ENTITIES } from "@/lib/admin/entityFieldConfig";

const TABLES = new Set(ENTITIES);

export async function POST(request, context) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { entity } = await context.params;
  if (!TABLES.has(entity)) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderedIds = body?.orderedIds;
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return NextResponse.json({ error: "orderedIds must be a non-empty array" }, { status: 400 });
  }

  const cfgErr = getSupabaseAdminConfigError();
  if (cfgErr) {
    return NextResponse.json({ error: cfgErr }, { status: 503 });
  }
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }

  for (let i = 0; i < orderedIds.length; i++) {
    const id = orderedIds[i];
    if (typeof id !== "string" || !id.trim()) {
      return NextResponse.json({ error: "Invalid id in orderedIds" }, { status: 400 });
    }
    const { error } = await admin.from(entity).update({ order_index: i }).eq("id", id.trim());
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/portfolio");
  revalidatePath("/internships");
  revalidatePath("/contact");

  return NextResponse.json({ ok: true });
}
