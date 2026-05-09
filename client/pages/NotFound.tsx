import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useLocale } from "@/i18n/LocaleContext";
import { t } from "@/i18n/dictionary";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const NotFound = () => {
  const location = useLocation();
  const params = useParams();
  const locale = params.locale ?? "en";
  const ctxLocale = useLocale();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">
            {t(ctxLocale, "notFound.oops")}
          </p>
        <div className="flex justify-center mb-4">
          <LanguageSwitcher />
        </div>
        <a
          href={`/${locale}/`}
          className="text-blue-500 hover:text-blue-700 underline"
        >
            {t(ctxLocale, "notFound.returnToHome")}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
