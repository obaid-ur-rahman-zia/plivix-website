import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "plivix_admin_ok";

/**
 * Admin may authenticate via httpOnly cookie (set by POST /api/admin/auth)
 * or `Authorization: Bearer <PLIVIX_ADMIN_SECRET>` / `x-plivix-admin` header.
 */
export async function verifyAdminRequest(request) {
  const configured = Boolean(process.env.PLIVIX_ADMIN_SECRET);
  if (!configured) return false;

  const bearer = request.headers.get("authorization");
  if (bearer?.startsWith("Bearer ")) {
    const t = bearer.slice(7);
    if (t === process.env.PLIVIX_ADMIN_SECRET) return true;
  }
  const hx = request.headers.get("x-plivix-admin");
  if (hx && hx === process.env.PLIVIX_ADMIN_SECRET) return true;

  const jar = await cookies();
  return jar.get(ADMIN_COOKIE_NAME)?.value === "1";
}
