-- Shton kolonën seo_intro në site_settings (për faqe ekzistuese).
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS seo_intro TEXT;
