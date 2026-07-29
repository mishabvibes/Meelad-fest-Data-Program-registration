import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isSessionValid } from "@/lib/session";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isProtectedPage = pathname.startsWith("/admin/dashboard");
  const isProtectedApi =
    pathname.startsWith("/api/admin/registrations") ||
    pathname.startsWith("/api/admin/settings") ||
    pathname.startsWith("/api/admin/export");

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const valid = await isSessionValid(token);

  if (valid) {
    return NextResponse.next();
  }

  if (isProtectedApi) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/api/admin/registrations/:path*",
    "/api/admin/settings/:path*",
    "/api/admin/export/:path*"
  ],
};
