import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminSessionSecret,
  readCookie,
  verifyAdminSessionToken,
} from "../../shared/adminSession.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const json = (status: number, body: Record<string, unknown>) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(status).json(body);
  };

  try {
    const secret = getAdminSessionSecret();
    const raw = req.headers?.cookie as string | undefined;
    const value = readCookie(raw, ADMIN_SESSION_COOKIE_NAME);
    const ok = verifyAdminSessionToken(value, secret);
    res.setHeader("Cache-Control", "no-store");
    json(ok ? 200 : 401, { authenticated: ok });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    res.setHeader("Cache-Control", "no-store");
    json(500, { error: "server_error", message });
  }
}
