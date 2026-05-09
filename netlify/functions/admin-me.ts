import type { Handler } from "@netlify/functions";
import {
  cookieName,
  getCookieFromHeader,
  verifySessionValue,
} from "./_adminCookie";

const DEFAULT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return { statusCode: 500, body: "Missing ADMIN_SESSION_SECRET" };
  }

  const cookieHeader =
    event.headers.cookie ?? event.headers.Cookie ?? event.headers.COOKIE;
  const val = getCookieFromHeader(cookieHeader, cookieName());
  const ok = verifySessionValue(val, secret, DEFAULT_MAX_AGE_MS);

  return {
    statusCode: ok ? 200 : 401,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    body: JSON.stringify({ authenticated: ok }),
  };
};

