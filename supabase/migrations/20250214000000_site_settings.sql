-- Site & SEO settings (one row). Used for meta tags, landing copy, footer.
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  landing_headline TEXT,
  landing_subhead TEXT,
  footer_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert single row if none exists
INSERT INTO site_settings (meta_title, meta_description, landing_headline, landing_subhead, footer_text)
SELECT
  'OldGem.Net - Free Premium Old Gem Videos!',
  'OldGem.Net - Free Premium Old Gem Videos! Watch exclusive content with free registration.',
  'Featured Content',
  'Browse our premium collection. Click on any item to get free access.',
  'Adults only. 18+. By entering you confirm you are of legal age.'
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- Enable RLS and allow read for anon (public site needs to read)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON site_settings
  FOR SELECT USING (true);

-- Only authenticated users (admin) can update - use your auth in app
-- For now we allow anon to update if you use service key in admin; otherwise add auth policy.
CREATE POLICY "Allow anon all for now" ON site_settings
  FOR ALL USING (true) WITH CHECK (true);

COMMENT ON TABLE site_settings IS 'Single-row site config: SEO meta, landing headline/subhead, footer.';
