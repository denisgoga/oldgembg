-- Homepage ad banners (admin-managed). Public site reads active rows only via catalog API / Supabase SELECT.
CREATE TABLE IF NOT EXISTS homepage_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL DEFAULT '',
  size TEXT NOT NULL DEFAULT '300x250'
    CONSTRAINT homepage_banners_size_check CHECK (size IN ('300x250', '300x100', 'native')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  alt_text TEXT NOT NULL DEFAULT 'Advertisement',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS homepage_banners_active_sort_idx
  ON homepage_banners (is_active, sort_order, created_at DESC);

COMMENT ON TABLE homepage_banners IS 'Grid banners on the homepage after every three video thumbnails.';

ALTER TABLE homepage_banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read homepage banners" ON homepage_banners;
DROP POLICY IF EXISTS "Allow all homepage banners" ON homepage_banners;

CREATE POLICY "Allow public read homepage banners" ON homepage_banners
  FOR SELECT USING (true);

CREATE POLICY "Allow all homepage banners" ON homepage_banners
  FOR ALL USING (true) WITH CHECK (true);
