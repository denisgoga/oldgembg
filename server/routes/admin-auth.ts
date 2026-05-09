import type { RequestHandler } from "express";
import { z } from "zod";
import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminPassword,
  getAdminSessionMaxAgeMs,
  getAdminSessionSecret,
  makeAdminSessionToken,
  verifyAdminSessionToken,
} from "../../shared/adminSession";

const loginBodySchema = z.object({
  password: z.string().min(1),
});

export const handleAdminLogin: RequestHandler = (req, res) => {
  const parsed = loginBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "bad_request", message: "Password is required." });
    return;
  }
  const { password } = parsed.data;

  try {
    if (password !== getAdminPassword()) {
      res.status(401).json({ error: "invalid_credentials" });
      return;
    }

    const secret = getAdminSessionSecret();
    res.cookie(ADMIN_SESSION_COOKIE_NAME, makeAdminSessionToken(secret), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getAdminSessionMaxAgeMs(),
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    res.status(500).json({ error: "server_error", message });
  }
};

export const handleAdminLogout: RequestHandler = (_req, res) => {
  res.clearCookie(ADMIN_SESSION_COOKIE_NAME, { path: "/" });
  res.status(200).json({ ok: true });
};

export const handleAdminMe: RequestHandler = (req, res) => {
  try {
    const secret = getAdminSessionSecret();
    const cookieValue = req.cookies?.[ADMIN_SESSION_COOKIE_NAME] as string | undefined;
    const ok = verifyAdminSessionToken(cookieValue, secret);
    if (!ok) {
      res.status(401).json({ authenticated: false });
      return;
    }
    res.status(200).json({ authenticated: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    res.status(500).json({ error: "server_error", message });
  }
};
