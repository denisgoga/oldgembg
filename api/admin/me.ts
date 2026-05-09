import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminSessionSecret,
  readCookie,
  verifyAdminSessionToken,
} from "../../shared/adminSession";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const secret = getAdminSessionSecret();
    const raw = req.headers?.cookie as string | undefined;
    const value = readCookie(raw, ADMIN_SESSION_COOKIE_NAME);
    const ok = verifyAdminSessionToken(value, secret);
    res.setHeader("Cache-Control", "no-store");
    res.status(ok ? 200 : 401).json({ authenticated: ok });
  } catch (e) {
    res.status(500).send(e instanceof Error ? e.message : "Server error");
  }
}
