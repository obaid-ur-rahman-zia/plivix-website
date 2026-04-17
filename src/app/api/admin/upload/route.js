import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/adminServer";

const BUCKET = "site-media";

export async function POST(request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Supabase service role not configured" },
      { status: 503 }
    );
  }
  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form-data" }, { status: 400 });
  }
  const file = form.get("file");
  const path = form.get("path")?.toString?.() || (file && typeof file === "object" && "name" in file ? file.name : null);
  if (!file || typeof file === "string" || !path) {
    return NextResponse.json({ error: "file and path required" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { data, error } = await admin.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: true,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = admin.storage.from(BUCKET).getPublicUrl(data.path);

  return NextResponse.json({ path: data.path, publicUrl });
}
