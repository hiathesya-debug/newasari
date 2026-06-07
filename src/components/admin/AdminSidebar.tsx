import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, Flower2, ClipboardList, Globe, FileText,
  ChevronsLeft, ChevronsRight, LogOut,
} from "lucide-react";
import { signOut, useAuth } from "@/lib/auth";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Management Products", icon: Flower2 },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/website", label: "Management Website", icon: Globe },
  { to: "/admin/sop", label: "Standard Operating Procedure", icon: FileText },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useAuth();

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-[var(--asari-blush-light)] transition-all duration-200 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      <div className={`flex flex-col items-center py-6 border-b border-[var(--asari-blush-light)] ${collapsed ? "px-2" : "px-4"}`}>
        <Link to="/admin" className="flex flex-col items-center leading-none">
          <span className="font-display italic text-3xl text-[var(--asari-gold)]">Asari</span>
          {!collapsed && (
            <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--asari-charcoal)] mt-1">
              bouquet &amp; flower
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 py-4 space-y-1">
        {NAV.map((n) => {
          const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to}
              title={collapsed ? n.label : undefined}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm border-l-[3px] transition-colors ${
                active
                  ? "border-[var(--asari-gold)] bg-[var(--asari-champagne)]/30 text-[var(--asari-gold)] font-medium"
                  : "border-transparent text-[var(--asari-charcoal)] hover:bg-[var(--asari-peach)]/20"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{n.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--asari-blush-light)] p-3 space-y-1">
        {user && !collapsed && (
          <div className="px-2 py-2 text-xs">
            <div className="font-medium text-[var(--asari-charcoal)] truncate">{user.name}</div>
            <div className="text-[var(--asari-coral)] capitalize">{user.role}</div>
          </div>
        )}
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-2 py-2 text-sm rounded text-[var(--asari-charcoal)] hover:bg-[var(--asari-peach)]/20"
          title="Sign out"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-3 w-full px-2 py-2 text-sm rounded text-[var(--asari-charcoal)] hover:bg-[var(--asari-peach)]/20"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
