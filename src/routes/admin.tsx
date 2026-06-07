import { createFileRoute, Outlet, useRouterState, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    if (location.pathname === "/admin/login") return;
    // Defer actual session check to the component for snappy SPA UX.
  },
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") { setReady(true); return; }
    let cancelled = false;
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        if (!cancelled) navigate({ to: "/admin/login" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.session.user.id);
      const ok = (roles ?? []).some((r) => r.role === "admin" || r.role === "staff");
      if (!ok) {
        if (!cancelled) navigate({ to: "/admin/login" });
        return;
      }
      if (!cancelled) setReady(true);
    })();
    return () => { cancelled = true; };
  }, [pathname, navigate]);

  if (!ready) return null;
  if (pathname === "/admin/login") return <Outlet />;
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
