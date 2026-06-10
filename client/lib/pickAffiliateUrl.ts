import type { PopupSettings } from "@/lib/supabase";

/** Pick affiliate URL using optional A/B weighted routing from popup settings. */
export function pickAffiliateUrl(popupSettings: PopupSettings | null): string {
  if (!popupSettings) return "";

  const a = (popupSettings.affiliate_link_a ?? "").trim();
  const b = (popupSettings.affiliate_link_b ?? "").trim();
  const legacy = (popupSettings.affiliate_link ?? "").trim();

  const hasA = a.length > 0;
  const hasB = b.length > 0;

  if (hasA && hasB) {
    const splitA = Math.min(
      100,
      Math.max(0, popupSettings.affiliate_split_a ?? 50),
    );
    return Math.random() * 100 < splitA ? a : b;
  }
  if (hasA) return a;
  if (hasB) return b;
  return legacy;
}
