import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin, getSupabaseAdminConfigError } from "@/lib/supabase/adminServer";

const TABLES = new Set([
  "services",
  "projects",
  "team",
  "testimonials",
  "stats",
  "internships",
  "pricing_plans",
  "faqs",
]);

export async function GET(request, context) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { entity } = await context.params;
  if (!TABLES.has(entity)) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  }
  const cfgErr = getSupabaseAdminConfigError();
  if (cfgErr) {
    return NextResponse.json({ error: cfgErr }, { status: 503 });
  }
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }
  const { data, error } = await admin.from(entity).select("*").order("order_index", { ascending: true });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data ?? [] });
}

export async function PATCH(request, context) {
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
  const id = body.id;
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  const { id: _drop, ...patch } = body;
  const cfgErrPatch = getSupabaseAdminConfigError();
  if (cfgErrPatch) {
    return NextResponse.json({ error: cfgErrPatch }, { status: 503 });
  }
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }
  const { data, error } = await admin.from(entity).update(patch).eq("id", id).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  revalidateTag("cms");
  revalidatePath("/", "layout");
  return NextResponse.json({ data });
}

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
  const insert = { ...body };
  delete insert.id;
  const cfgErr = getSupabaseAdminConfigError();
  if (cfgErr) {
    return NextResponse.json({ error: cfgErr }, { status: 503 });
  }
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }
  const { data, error } = await admin.from(entity).insert(insert).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  revalidateTag("cms");
  revalidatePath("/", "layout");
  return NextResponse.json({ data });
}

export async function DELETE(request, context) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { entity } = await context.params;
  if (!TABLES.has(entity)) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 404 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id query param required" }, { status: 400 });
  }
  const cfgErr = getSupabaseAdminConfigError();
  if (cfgErr) {
    return NextResponse.json({ error: cfgErr }, { status: 503 });
  }
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 503 });
  }
  const { error } = await admin.from(entity).delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  revalidateTag("cms");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
