import { useMemo } from "react";
import type { Locale } from "@/i18n/locales";
import { SUPPORTED_LOCALES } from "@/i18n/locales";
import { useLocale } from "@/i18n/LocaleContext";

function FlagIcon({ locale }: { locale: Locale }) {
  // Simple inline SVG flags (keeps it dependency-free).
  const commonProps = { width: 20, height: 14, viewBox: "0 0 20 14" };

  if (locale === "de") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <rect x="0" y="0" width="20" height="14" fill="#000000" />
        <rect x="0" y="4.6667" width="20" height="4.6667" fill="#C8102E" />
        <rect x="0" y="9.3334" width="20" height="4.6666" fill="#FFCE00" />
      </svg>
    );
  }

  if (locale === "it") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <rect x="0" y="0" width="6.6667" height="14" fill="#009246" />
        <rect x="6.6667" y="0" width="6.6666" height="14" fill="#FFFFFF" />
        <rect x="13.3333" y="0" width="6.6667" height="14" fill="#CE2B37" />
      </svg>
    );
  }

  if (locale === "fr") {
    return (
      <svg {...commonProps} aria-hidden="true">
        <rect x="0" y="0" width="6.6667" height="14" fill="#0055A4" />
        <rect x="6.6667" y="0" width="6.6666" height="14" fill="#FFFFFF" />
        <rect x="13.3333" y="0" width="6.6667" height="14" fill="#EF4135" />
      </svg>
    );
  }

  if (locale === "es") {
    // Spain: red-yellow-red horizontal (simple version, no coat-of-arms)
    return (
      <svg {...commonProps} aria-hidden="true">
        <rect x="0" y="0" width="20" height="3.5" fill="#AA151B" />
        <rect x="0" y="3.5" width="20" height="7" fill="#F1BF00" />
        <rect x="0" y="10.5" width="20" height="3.5" fill="#AA151B" />
      </svg>
    );
  }

  // en (UK-like simplified): blue background + red/white cross.
  return (
    <svg {...commonProps} aria-hidden="true">
      <rect x="0" y="0" width="20" height="14" fill="#012169" />
      <path
        d="M0 4 L4 4 L20 0 L20 3 L6 7 L20 11 L20 14 L4 10 L0 10 Z"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <rect x="8" y="0" width="4" height="14" fill="#FFFFFF" opacity="0.95" />
      <rect x="0" y="5" width="20" height="4" fill="#FFFFFF" opacity="0.95" />
      <rect x="8.2" y="0" width="3.6" height="14" fill="#C8102E" opacity="0.95" />
      <rect x="0" y="5.2" width="20" height="3.6" fill="#C8102E" opacity="0.95" />
    </svg>
  );
}

function getLocaleFromPath(pathname: string): Locale | null {
  const match = pathname.match(/^\/(en|de|it|es|fr)(\/|$)/);
  if (!match) return null;
  return match[1] as Locale;
}

function switchLocaleInPath(nextLocale: Locale) {
  const { pathname, search, hash } = window.location;
  const currentLocale = getLocaleFromPath(pathname);

  const segments = pathname.split("/").filter(Boolean);
  let restSegments = segments;
  if (currentLocale) {
    restSegments = segments.slice(1);
  }

  const rest = restSegments.join("/");
  const nextPath = `/${nextLocale}/${rest}`;

  // Keep nice home URL: "/{locale}/"
  const finalPath = rest.length === 0 ? `/${nextLocale}/` : nextPath;
  window.location.assign(`${finalPath}${search}${hash}`);
}

export function LanguageSwitcher() {
  const locale = useLocale();

  const options = useMemo(() => {
    return SUPPORTED_LOCALES.map((l) => ({
      value: l,
      label:
        l === "en"
          ? "English"
          : l === "de"
            ? "German"
            : l === "it"
              ? "Italian"
              : l === "es"
                ? "Spanish"
                : "French",
    }));
  }, []);

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden sm:inline text-muted-foreground">Language</span>
      <div className="relative">
        <select
          value={locale}
          onChange={(e) => switchLocaleInPath(e.target.value as Locale)}
          className="appearance-none px-3 py-2 pr-9 bg-input border border-border rounded text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Select language"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
          {/* Dropdown chevron */}
          <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M5 7l5 6 5-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div className="hidden sm:block">
        <FlagIcon locale={locale} />
      </div>
    </label>
  );
}

