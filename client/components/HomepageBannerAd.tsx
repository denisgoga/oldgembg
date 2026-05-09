import type { PublicHomepageBanner } from "@shared/api";
import { cn } from "@/lib/utils";
import { CATALOG_THUMBNAIL_FRAME_CLASS } from "@/components/VideoCard";

const FIXED_IMG_BOX: Partial<Record<PublicHomepageBanner["size"], string>> = {
  "300x250": "w-[300px] h-[250px]",
  "300x100": "w-[300px] h-[100px]",
};

type Props = { banner: PublicHomepageBanner };

/** One column cell width matching `grid gap-6` + breakpoints in catalog grid */
const NATIVE_WIDTH =
  "w-full shrink-0 sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)] mx-auto";

export function HomepageBannerAd({ banner }: Props) {
  const alt = banner.alt_text?.trim() || "Advertisement";
  const link = banner.link_url?.trim();

  if (banner.size === "native") {
    const shell = cn(
      CATALOG_THUMBNAIL_FRAME_CLASS,
      NATIVE_WIDTH,
      "block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    );
    const nativeImg = (
      <img
        src={banner.image_url}
        alt={alt}
        className="h-full w-full object-cover bg-card"
        loading="lazy"
        decoding="async"
      />
    );
    const outbound = link ? /^https?:\/\//i.test(link) : false;
    if (link) {
      return (
        <a
          href={link}
          className={shell}
          {...(outbound ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {nativeImg}
        </a>
      );
    }
    return <div className={shell}>{nativeImg}</div>;
  }

  const box = FIXED_IMG_BOX[banner.size] ?? FIXED_IMG_BOX["300x250"]!;
  const img = (
    <img
      src={banner.image_url}
      alt={alt}
      className={`${box} object-contain bg-card`}
      loading="lazy"
      decoding="async"
    />
  );

  if (link) {
    const outbound = /^https?:\/\//i.test(link);
    return (
      <a
        href={link}
        className="block max-w-[300px] w-full mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md overflow-hidden"
        {...(outbound ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {img}
      </a>
    );
  }

  return (
    <div className="max-w-[300px] w-full mx-auto rounded-md overflow-hidden border border-border">
      {img}
    </div>
  );
}
