import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleDemo } from "./routes/demo";
import { handlePublicCatalog } from "./routes/public-catalog";
import {
  handleAdminLogin,
  handleAdminLogout,
  handleAdminMe,
} from "./routes/admin-auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  /** Cached catalog (videos + site_settings) — CDN-friendly Cache-Control. */
  app.get("/api/public/catalog", handlePublicCatalog);

  // Admin auth (httpOnly cookie session)
  app.post("/api/admin/login", handleAdminLogin);
  app.post("/api/admin/logout", handleAdminLogout);
  app.get("/api/admin/me", handleAdminMe);

  return app;
}
