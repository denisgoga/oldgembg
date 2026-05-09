import type { Handler } from "@netlify/functions";
import {
  formatSetCookieHeader,
  getAdminPassword,
  getAdminSessionMaxAgeMs,
  getAdminSessionSecret,
  makeAdminSessionToken,
} from "../../shared/adminSession";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let password = "";
  try {
    const body = JSON.parse(event.body || "{}") as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    // ignore parse errors
  }

  try {
    if (!password || password !== getAdminPassword()) {
      return { statusCode: 401, body: "Unauthorized" };
    }

    const secret = getAdminSessionSecret();
    const isProd = process.env.NODE_ENV === "production";
    const maxAgeSeconds = Math.floor(getAdminSessionMaxAgeMs() / 1000);
    const cookie = formatSetCookieHeader(makeAdminSessionToken(secret), {
      isProd,
      maxAgeSeconds,
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
  } catch (e) {
    return {
      statusCode: 500,
      body: e instanceof Error ? e.message : "Server error",
    };
  }
};
