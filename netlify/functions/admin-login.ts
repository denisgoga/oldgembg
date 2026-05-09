import type { Handler } from "@netlify/functions";
import { buildSetCookie, makeSessionValue } from "./_adminCookie";

const DEFAULT_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!adminPassword || !secret) {
    return { statusCode: 500, body: "Missing ADMIN_PASSWORD/ADMIN_SESSION_SECRET" };
  }

  let password = "";
  try {
    const body = JSON.parse(event.body || "{}") as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    // ignore parse errors
  }

  if (!password || password !== adminPassword) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const isProd = process.env.NODE_ENV === "production";
  const cookie = buildSetCookie(makeSessionValue(secret), {
    isProd,
    maxAgeSeconds: DEFAULT_MAX_AGE_SECONDS,
  });

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookie,
      "Cache-Control": "no-store",
    },
    body: JSON.stringify({ ok: true }),
  };
};

