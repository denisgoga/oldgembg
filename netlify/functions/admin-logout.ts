import type { Handler } from "@netlify/functions";
import { buildClearCookie } from "./_adminCookie";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const isProd = process.env.NODE_ENV === "production";
  const cookie = buildClearCookie({ isProd });

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

