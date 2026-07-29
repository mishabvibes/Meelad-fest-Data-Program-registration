import { NextResponse } from "next/server";
import { createSessionToken, ADMIN_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/session";

export async function POST(req) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { ok: false, message: "സെർവറിൽ ADMIN_PASSWORD സെറ്റ് ചെയ്തിട്ടില്ല" },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json(
      { ok: false, message: "പാസ്‌വേഡ് തെറ്റാണ്" },
      { status: 401 }
    );
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return res;
}
