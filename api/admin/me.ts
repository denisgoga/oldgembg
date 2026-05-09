import {
  cookieName,
  getCookieFromHeader,
  verifySessionValue,
} from "../_lib/adminCookie";

const DEFAULT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    res.status(500).send("Missing ADMIN_SESSION_SECRET");
    return;
  }

  const rawCookie = req.headers?.cookie as string | undefined;
  const value = getCookieFromHeader(rawCookie, cookieName());
  const ok = verifySessionValue(value, secret, DEFAULT_MAX_AGE_MS);

  res.setHeader("Cache-Control", "no-store");
  res.status(ok ? 200 : 401).json({ authenticated: ok });
}
