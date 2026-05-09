import {
  formatSetCookieHeader,
  getAdminPassword,
  getAdminSessionMaxAgeMs,
  getAdminSessionSecret,
  makeAdminSessionToken,
} from "../../shared/adminSession";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!password || password !== getAdminPassword()) {
      res.status(401).json({ error: "invalid_credentials" });
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
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).send(e instanceof Error ? e.message : "Server error");
  }
}
