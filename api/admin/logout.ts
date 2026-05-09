import { buildClearCookie } from "../_lib/adminCookie.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const isProd = process.env.NODE_ENV === "production";
  res.setHeader("Set-Cookie", buildClearCookie(isProd));
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({ ok: true });
}
