import type { RequestHandler } from "express";
import crypto from "crypto";
import { z } from "zod";

const COOKIE_NAME = "admin_session";

function getAdminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    throw new Error("Missing ADMIN_PASSWORD env var");
  }
  return pw;
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET env var");
  }
  return secret;
}

function base64UrlEncode(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64UrlDecodeToBuffer(input: string): Buffer {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const withPad = padded + "=".repeat(padLen);
  return Buffer.from(withPad, "base64");
}

function signSession(payloadB64: string): string {
  const secret = getSessionSecret();
  const sig = crypto.createHmac("sha256", secret).update(payloadB64).digest();
  return base64UrlEncode(sig);
}

function makeSessionCookieValue(): string {
  const payload = { iat: Date.now() };
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const sigB64 = signSession(payloadB64);
  return `${payloadB64}.${sigB64}`;
}

function verifySessionCookieValue(value: string | undefined): boolean {
  if (!value) return false;
  const [payloadB64, sigB64] = value.split(".");
  if (!payloadB64 || !sigB64) return false;

  const expectedSigB64 = signSession(payloadB64);

  // Timing-safe compare
  const a = Buffer.from(sigB64);
  const b = Buffer.from(expectedSigB64);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  try {
    const payload = JSON.parse(base64UrlDecodeToBuffer(payloadB64).toString("utf8")) as {
      iat?: number;
    };
    if (!payload?.iat || !Number.isFinite(payload.iat)) return false;

    // Optional: expire sessions (defaults 7 days)
    const maxAgeMsRaw = process.env.ADMIN_SESSION_MAX_AGE_MS ?? String(7 * 24 * 60 * 60 * 1000);
    const maxAgeMs = Number.parseInt(maxAgeMsRaw, 10);
    const maxAge = Number.isFinite(maxAgeMs) && maxAgeMs > 0 ? maxAgeMs : 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - payload.iat > maxAge) return false;

    return true;
  } catch {
    return false;
  }
}

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true as const,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: Number.parseInt(process.env.ADMIN_SESSION_MAX_AGE_MS ?? "", 10) || 7 * 24 * 60 * 60 * 1000,
  };
}

const loginBodySchema = z.object({
  password: z.string().min(1),
});

export const handleAdminLogin: RequestHandler = (req, res) => {
  try {
    const { password } = loginBodySchema.parse(req.body);
    const ok = password === getAdminPassword();
    if (!ok) {
      res.status(401).json({ error: "invalid_credentials" });
      return;
    }

    res.cookie(COOKIE_NAME, makeSessionCookieValue(), cookieOptions());
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(400).json({
      error: "bad_request",
      message: err instanceof Error ? err.message : "Invalid request",
    });
  }
};

export const handleAdminLogout: RequestHandler = (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.status(200).json({ ok: true });
};

export const handleAdminMe: RequestHandler = (req, res) => {
  const cookieValue = req.cookies?.[COOKIE_NAME] as string | undefined;
  if (!verifySessionCookieValue(cookieValue)) {
    res.status(401).json({ authenticated: false });
    return;
  }
  res.status(200).json({ authenticated: true });
};

