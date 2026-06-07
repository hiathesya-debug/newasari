import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, signOut } from "@/lib/auth";
import { CustomerLayout } from "@/components/CustomerLayout";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Package, User, Home } from "lucide-react";

export const Route = createFileRoute("/account")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/login" });
  },
  component: AccountLayout,
});

function AccountLayout() {
  const user = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/login" });
      else setReady(true);
    });
  }, [navigate]);

  if (!ready) return null;

  return (
    <CustomerLayout>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <h1 className="font-display text-4xl">
            Hi, <span className="italic text-[var(--asari-gold)]">{user?.name ?? "Pelanggan"}</span>! 👋
          </h1>
          <button
            onClick={async () => {
              await signOut();
              navigate({ to: "/" });
            }}
            className="text-xs uppercase tracking-widest inline-flex items-center gap-2 text-[var(--asari-charcoal)] hover:text-[var(--asari-gold)]"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
        <div className="h-px bg-[var(--asari-gold)] mb-6" />

        <nav className="flex gap-2 mb-8 flex-wrap">
          <NavPill to="/account" exact icon={<Home className="h-4 w-4" />} pathname={pathname}>Overview</NavPill>
          <NavPill to="/account/orders" icon={<Package className="h-4 w-4" />} pathname={pathname}>My Orders</NavPill>
          <NavPill to="/account" exact icon={<User className="h-4 w-4" />} pathname={pathname}>Settings</NavPill>
        </nav>

        <Outlet />
      </div>
    </CustomerLayout>
  );
}

function NavPill({
  to, children, icon, pathname, exact,
}: {
  to: string; children: React.ReactNode; icon: React.ReactNode; pathname: string; exact?: boolean;
}) {
  const active = exact ? pathname === to : pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-widest ${
        active
          ? "bg-[var(--asari-charcoal)] text-white"
          : "border border-[var(--asari-charcoal)]/30 hover:border-[var(--asari-gold)]"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
