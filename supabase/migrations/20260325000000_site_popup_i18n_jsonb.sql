-- Add i18n JSONB columns to store per-locale translations.
-- This keeps existing English columns intact for backward compatibility.

ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS site_translations JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE popup_settings
ADD COLUMN IF NOT EXISTS popup_translations JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Seed English ('en') translations from existing columns (if missing).
UPDATE site_settings
SET site_translations =
  CASE
    WHEN site_translations ? 'en' THEN site_translations
    ELSE
      site_translations || jsonb_build_object(
        'en',
        jsonb_build_object(
          'meta_title', meta_title,
          'meta_description', meta_description,
          'landing_headline', landing_headline,
          'landing_subhead', landing_subhead,
          'seo_intro', seo_intro,
          'footer_text', footer_text
        )
      )
  END;

UPDATE popup_settings
SET popup_translations =
  CASE
    WHEN popup_translations ? 'en' THEN popup_translations
    ELSE
      popup_translations || jsonb_build_object(
        'en',
        jsonb_build_object(
          'title', title,
          'description', description,
          'button_text', button_text,
          'waiting_title', waiting_title,
          'waiting_description', waiting_description,
          'waiting_button_text', waiting_button_text
        )
      )
  END;

