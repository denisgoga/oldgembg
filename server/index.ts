import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handlePublicCatalog } from "./routes/public-catalog";
import {
  handleAdminLogin,
  handleAdminLogout,
  handleAdminMe,
} from "./routes/admin-auth";

export function createServer() {
  const app = express();

  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get("/api/ping", (_req, res) => {
    res.json({ message: process.env.PING_MESSAGE ?? "ping" });
  });

  app.get("/api/public/catalog", handlePublicCatalog);

  app.post("/api/admin/login", handleAdminLogin);
  app.post("/api/admin/logout", handleAdminLogout);
  app.get("/api/admin/me", handleAdminMe);

  return app;
}
