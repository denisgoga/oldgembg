import { Link, useInRouterContext } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/LocaleContext";

type LogoProps = {
  className?: string;
  /** Same-route home (e.g. reset catalog page to 1 without remounting). */
  onNavigateHome?: () => void;
};

export function Logo({ className, onNavigateHome }: LogoProps) {
  const locale = useLocale();
  const inRouter = useInRouterContext();
  const to = `/${locale}/`;

  const handleHomeClick = () => {
    onNavigateHome?.();
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  };

  const linkClass = cn(
    "inline-block shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md transition-opacity hover:opacity-90",
    className,
  );

  const wordmark = (
    <span className="flex h-16 min-w-0 items-center gap-1.5">
      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
        OldGem
      </span>
      <span className="text-lg font-semibold leading-none text-muted-foreground sm:text-xl">
        .Net
      </span>
    </span>
  );

  if (inRouter) {
    return (
      <Link
        to={to}
        className={linkClass}
        aria-label="OldGem.Net — Home"
        onClick={handleHomeClick}
      >
        {wordmark}
      </Link>
    );
  }

  return (
    <a
      href={to}
      className={linkClass}
      aria-label="OldGem.Net — Home"
      onClick={handleHomeClick}
    >
      {wordmark}
    </a>
  );
}
