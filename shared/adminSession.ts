import crypto from "crypto";

export const ADMIN_SESSION_COOKIE_NAME = "admin_session";

const DEFAULT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

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

export function getAdminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("Missing ADMIN_PASSWORD env var");
  return pw;
}

export function getAdminSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("Missing ADMIN_SESSION_SECRET env var");
  return secret;
}

export function getAdminSessionMaxAgeMs(): number {
  const raw = process.env.ADMIN_SESSION_MAX_AGE_MS ?? String(DEFAULT_MAX_AGE_MS);
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MAX_AGE_MS;
}

/** Signed cookie value: base64url(payload).base64url(hmac). Compatible across Express / Netlify / Vercel. */
export function makeAdminSessionToken(secret: string): string {
  const payloadB64 = base64UrlEncode(
    Buffer.from(JSON.stringify({ iat: Date.now() }), "utf8"),
  );
  return `${payloadB64}.${sign(payloadB64, secret)}`;
}

export function verifyAdminSessionToken(
  value: string | undefined,
  secret: string,
  maxAgeMs = getAdminSessionMaxAgeMs(),
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

export function readCookie(header: string | undefined, name: string): string | undefined {
  if (!header) return undefined;
  for (const p of header.split(";").map((s) => s.trim())) {
    const eq = p.indexOf("=");
    if (eq <= 0) continue;
    if (p.slice(0, eq) === name) return p.slice(eq + 1);
  }
  return undefined;
}

/** Raw `Set-Cookie` for Netlify / Vercel serverless. */
export function formatSetCookieHeader(
  sessionToken: string,
  opts: { isProd: boolean; maxAgeSeconds: number },
): string {
  const parts = [
    `${ADMIN_SESSION_COOKIE_NAME}=${sessionToken}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${opts.maxAgeSeconds}`,
  ];
  if (opts.isProd) parts.push("Secure");
  return parts.join("; ");
}

export function formatClearCookieHeader(isProd: boolean): string {
  const parts = [
    `${ADMIN_SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (isProd) parts.push("Secure");
  return parts.join("; ");
}
