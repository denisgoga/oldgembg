# Site & SEO settings (Admin)

Për të përdorur **Site & SEO** në Admin (meta title, description, headline, subhead, footer), duhet të ekzistojë tabela `site_settings` në Supabase.

## Hapi 1: Krijimi i tabelës në Supabase

1. Hap **Supabase Dashboard** → projekti yt → **SQL Editor**.
2. Kopjo dhe ekzekuto skedarin SQL nga:
   **`supabase/migrations/20250214000000_site_settings.sql`**

Ose ekzekuto direkt këtë SQL:

```sql
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

INSERT INTO site_settings (meta_title, meta_description, landing_headline, landing_subhead, footer_text)
SELECT
  'OldGem.Net - Free Premium Old Gem Videos!',
  'OldGem.Net - Free Premium Old Gem Videos! Watch exclusive content with free registration.',
  'Featured Content',
  'Browse our premium collection. Click on any item to get free access.',
  'Adults only. 18+. By entering you confirm you are of legal age.'
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow anon all for now" ON site_settings FOR ALL USING (true) WITH CHECK (true);
```

3. Ruaj ndryshimet.

## Hapi 2: Admin

Pas kësaj, në **Admin → Site & SEO** do të shfaqet forma. Nga aty mund të ndryshosh:

- **Meta title** dhe **Meta description** (për SEO dhe share në TikTok/social).
- **Landing headline** dhe **Landing subhead** (teksti në faqen kryesore).
- **Footer text** (p.sh. "Adults only. 18+.").

Nëse tabela nuk ekziston ende, faqja funksionon normalisht me vlera default; vetëm ndryshimet nga Admin nuk do të ruhen pa `site_settings`.
