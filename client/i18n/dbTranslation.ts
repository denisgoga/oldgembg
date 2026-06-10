import type {
  PopupSettings,
  SiteSettings,
  SiteTranslations,
  PopupTranslations,
} from "@/lib/supabase";
import type { Locale } from "./locales";

const FALLBACK_LOCALE: Locale = "en";

function pickTranslation<T extends Record<string, unknown>>(
  translations: Record<string, T> | null | undefined,
  locale: Locale,
) {
  if (!translations) return null;
  return (translations[locale] ?? translations[FALLBACK_LOCALE] ?? null) as
    | T
    | null;
}

export function getSiteStringsForLocale(
  site: SiteSettings | null,
  locale: Locale,
) {
  if (!site) {
    return {
      meta_title: null as string | null,
      meta_description: null as string | null,
      landing_headline: null as string | null,
      landing_subhead: null as string | null,
      seo_intro: null as string | null,
      footer_text: null as string | null,
    };
  }

  const tr =
    pickTranslation<SiteTranslations>(site.site_translations, locale) ?? {};

  return {
    meta_title: (tr.meta_title ?? site.meta_title) as string | null,
    meta_description: (tr.meta_description ??
      site.meta_description) as string | null,
    landing_headline: (tr.landing_headline ??
      site.landing_headline) as string | null,
    landing_subhead: (tr.landing_subhead ??
      site.landing_subhead) as string | null,
    seo_intro: (tr.seo_intro ?? site.seo_intro) as string | null,
    footer_text: (tr.footer_text ?? site.footer_text) as string | null,
    hide_landing_headline: (tr.hide_landing_headline ??
      false) as boolean,
    hide_landing_subhead: (tr.hide_landing_subhead ?? false) as boolean,
    hide_seo_intro: (tr.hide_seo_intro ?? false) as boolean,
  };
}

export function getPopupStringsForLocale(
  popup: PopupSettings | null,
  locale: Locale,
) {
  if (!popup) {
    return {
      title: "" as string,
      description: "" as string,
      button_text: "" as string,
      waiting_title: null as string | null,
      waiting_description: null as string | null,
      waiting_button_text: null as string | null,
      direct_link_hint: null as string | null,
    };
  }

  const tr =
    pickTranslation<PopupTranslations>(popup.popup_translations, locale) ?? {};

  return {
    title: (tr.title ?? popup.title) as string,
    description: (tr.description ?? popup.description) as string,
    button_text: (tr.button_text ?? popup.button_text) as string,
    waiting_title: (tr.waiting_title ?? popup.waiting_title) as
      | string
      | null,
    waiting_description: (tr.waiting_description ??
      popup.waiting_description) as string | null,
    waiting_button_text: (tr.waiting_button_text ??
      popup.waiting_button_text) as string | null,
    direct_link_hint: (tr.direct_link_hint ?? popup.direct_link_hint) as
      | string
      | null,
  };
}

