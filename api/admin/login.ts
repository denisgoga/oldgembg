import {
  buildSetCookie,
  makeSessionValue,
} from "../_lib/adminCookie";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!adminPassword || !secret) {
    res.status(500).send("Missing ADMIN_PASSWORD/ADMIN_SESSION_SECRET");
    return;
  }

  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!password || password !== adminPassword) {
    res.status(401).json({ error: "invalid_credentials" });
    return;
  }

  const isProd = process.env.NODE_ENV === "production";
  res.setHeader("Set-Cookie", buildSetCookie(makeSessionValue(secret), isProd));
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ ok: true });
}
