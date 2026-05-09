import type { Handler } from "@netlify/functions";
import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminSessionSecret,
  readCookie,
  verifyAdminSessionToken,
} from "../../shared/adminSession";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const secret = getAdminSessionSecret();
    const cookieHeader =
      event.headers.cookie ?? event.headers.Cookie ?? event.headers.COOKIE;
    const val = readCookie(cookieHeader, ADMIN_SESSION_COOKIE_NAME);
    const ok = verifyAdminSessionToken(val, secret);

    return {
      statusCode: ok ? 200 : 401,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ authenticated: ok }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e instanceof Error ? e.message : "Server error",
    };
  }
};
