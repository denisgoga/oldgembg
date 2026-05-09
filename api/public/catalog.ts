import { getSupabaseServerClient } from "../_lib/supabase.js";

const DEFAULT_TTL_MS = 60_000;
const DEFAULT_PAGE_LIMIT = 6;
type CacheEntry = { body: string; expiresAt: number };
const memoryCache = new Map<string, CacheEntry>();

function cacheTtlMs(): number {
  const raw = process.env.PUBLIC_CATALOG_CACHE_TTL_MS;
  if (raw === undefined || raw === "") return DEFAULT_TTL_MS;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_TTL_MS;
}

function pruneExpiredCache() {
  const now = Date.now();
  for (const [key, entry] of memoryCache) {
    if (entry.expiresAt <= now) memoryCache.delete(key);
  }
}

function parsePageParams(req: any): { page: number; limit: number; from: number; to: number } {
  const pageRaw = Array.isArray(req.query?.page) ? req.query.page[0] : req.query?.page;
  const limitRaw = Array.isArray(req.query?.limit) ? req.query.limit[0] : req.query?.limit;

  const page = Math.max(1, Number.parseInt(String(pageRaw ?? "1"), 10) || 1);
  const limit = Math.min(
    100,
    Math.max(
      1,
      Number.parseInt(String(limitRaw ?? String(DEFAULT_PAGE_LIMIT)), 10) || DEFAULT_PAGE_LIMIT,
    ),
  );
  const offset = (page - 1) * limit;
  return { page, limit, from: offset, to: offset + limit - 1 };
}

function setCatalogCacheHeaders(res: any) {
  const maxAge = process.env.PUBLIC_CATALOG_HTTP_MAX_AGE ?? "15";
  const sMaxAge = process.env.PUBLIC_CATALOG_HTTP_S_MAXAGE ?? "120";
  const swr = process.env.PUBLIC_CATALOG_HTTP_STALE_WHILE_REVALIDATE ?? "600";
  res.setHeader(
    "Cache-Control",
    `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`,
  );
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { page, limit, from, to } = parsePageParams(req);
  const cacheKey = `${page}:${limit}`;
  const now = Date.now();
  const ttl = cacheTtlMs();

  pruneExpiredCache();
  const cached = memoryCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    setCatalogCacheHeaders(res);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("X-Catalog-Cache", "HIT");
    res.status(200).send(cached.body);
    return;
  }

  try {
    const supabase = getSupabaseServerClient();
    const [videosRes, settingsRes, bannersRes] = await Promise.all([
      supabase
        .from("videos")
        .select("*", { count: "exact" })
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false })
        .range(from, to),
      supabase.from("site_settings").select("*").limit(1).maybeSingle(),
      supabase
        .from("homepage_banners")
        .select("id, image_url, link_url, size, alt_text")
        .eq("is_active", true)
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true }),
    ]);

    if (videosRes.error) throw videosRes.error;

    const bannersRaw = bannersRes.error ? [] : (bannersRes.data ?? []);
    const banners = bannersRaw.map((row: any) => ({
      id: row.id as string,
      image_url: row.image_url as string,
      link_url:
        typeof row.link_url === "string" && row.link_url.trim().length > 0
          ? row.link_url.trim()
          : null,
      size: row.size as "300x250" | "300x100" | "native",
      alt_text:
        typeof row.alt_text === "string" && row.alt_text.trim().length > 0
          ? row.alt_text.trim()
          : null,
    }));

    const payload = {
      videos: videosRes.data ?? [],
      siteSettings: settingsRes.error ? null : settingsRes.data,
      banners,
      page,
      limit,
      totalCount: videosRes.count ?? 0,
    };

    const body = JSON.stringify(payload);
    memoryCache.set(cacheKey, { body, expiresAt: now + ttl });

    setCatalogCacheHeaders(res);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("X-Catalog-Cache", "MISS");
    res.status(200).send(body);
  } catch (err) {
    console.error("[vercel-public-catalog]", err);
    res.setHeader("Cache-Control", "no-store");
    res.status(500).json({
      error: "catalog_unavailable",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
