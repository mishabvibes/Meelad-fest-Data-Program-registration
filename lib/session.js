// Uses the Web Crypto API (globalThis.crypto) so this works identically in
// Next.js Edge middleware and in normal Node.js API routes.

export const ADMIN_COOKIE_NAME = "meelad_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hour login session

function getSecret() {
  return process.env.SESSION_SECRET || "dev-only-insecure-secret";
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(value) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(sig);
}

export async function createSessionToken() {
  const payload = `admin:${Date.now() + MAX_AGE_SECONDS * 1000}`;
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function isSessionValid(token) {
  if (!token || typeof token !== "string") return false;
  const idx = token.lastIndexOf(".");
  if (idx === -1) return false;
  const value = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = await hmac(value);
  if (expected.length !== sig.length) return false;
  // constant-time-ish comparison
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  if (diff !== 0) return false;

  const [role, expiresAtStr] = value.split(":");
  if (role !== "admin") return false;
  return Date.now() < Number(expiresAtStr);
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
