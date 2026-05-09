import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const params = useParams();
  const locale = params.locale ?? "en";
  const [status, setStatus] = useState<"checking" | "authed" | "unauthed">(
    "checking",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/me", { credentials: "include" });
        if (cancelled) return;
        setStatus(res.ok ? "authed" : "unauthed");
      } catch {
        if (cancelled) return;
        setStatus("unauthed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking") return null;

  if (status !== "authed") {
    return <Navigate to={`/${locale}/admin-login`} replace />;
  }

  return <>{children}</>;
}
