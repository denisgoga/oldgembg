import crypto from "crypto";

const COOKIE_NAME = "admin_session";
const DEFAULT_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64UrlDecode(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + "=".repeat(padLen), "base64");
}

function sign(payloadB64: string, secret: string): string {
  const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest();
  return base64UrlEncode(sig);
}

export function cookieName(): string {
  return COOKIE_NAME;
}

export function makeSessionValue(secret: string): string {
  const payload = Buffer.from(JSON.stringify({ iat: Date.now() }), "utf8");
  const payloadB64 = base64UrlEncode(payload);
  const sigB64 = sign(payloadB64, secret);
  return `${payloadB64}.${sigB64}`;
}

export function verifySessionValue(
  value: string | undefined,
  secret: string,
  maxAgeMs = DEFAULT_MAX_AGE_SECONDS * 1000,
): boolean {
  if (!value) return false;
  const [payloadB64, sigB64] = value.split(".");
  if (!payloadB64 || !sigB64) return false;

  const expected = sign(payloadB64, secret);
  const a = Buffer.from(sigB64);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  try {
    const payload = JSON.parse(base64UrlDecode(payloadB64).toString("utf8")) as {
      iat?: number;
    };
    if (!payload?.iat || !Number.isFinite(payload.iat)) return false;
    return Date.now() - payload.iat <= maxAgeMs;
  } catch {
    return false;
  }
}

export function buildSetCookie(value: string, isProd: boolean): string {
  const parts = [
    `${COOKIE_NAME}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${DEFAULT_MAX_AGE_SECONDS}`,
  ];
  if (isProd) parts.push("Secure");
  return parts.join("; ");
}

export function buildClearCookie(isProd: boolean): string {
  const parts = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (isProd) parts.push("Secure");
  return parts.join("; ");
}

export function getCookieFromHeader(
  cookieHeader: string | undefined,
  name: string,
): string | undefined {
  if (!cookieHeader) return undefined;
  const parts = cookieHeader.split(";").map((s) => s.trim());
  for (const p of parts) {
    const eq = p.indexOf("=");
    if (eq <= 0) continue;
    const k = p.slice(0, eq);
    if (k !== name) continue;
    return p.slice(eq + 1);
  }
  return undefined;
}
