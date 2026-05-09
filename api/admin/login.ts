import {
  formatSetCookieHeader,
  getAdminPassword,
  getAdminSessionMaxAgeMs,
  getAdminSessionSecret,
  makeAdminSessionToken,
} from "../../shared/adminSession.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const json = (status: number, body: Record<string, unknown>) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(status).json(body);
  };

  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!password) {
    json(400, { error: "bad_request", message: "Password is required." });
    return;
  }

  try {
    if (password !== getAdminPassword()) {
      json(401, { error: "invalid_credentials" });
      return;
    }

    const secret = getAdminSessionSecret();
    const isProd = process.env.NODE_ENV === "production";
    const maxAgeSeconds = Math.floor(getAdminSessionMaxAgeMs() / 1000);
    res.setHeader(
      "Set-Cookie",
      formatSetCookieHeader(makeAdminSessionToken(secret), { isProd, maxAgeSeconds }),
    );
    res.setHeader("Cache-Control", "no-store");
    json(200, { ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    res.setHeader("Cache-Control", "no-store");
    json(500, { error: "server_error", message });
  }
}
