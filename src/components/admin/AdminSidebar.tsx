import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Flower2, ClipboardList, Globe, FileText,
  ChevronsLeft, ChevronsRight, LogOut, Users, Menu, X, Star,
} from "lucide-react";
import { signOut, useAuth, isOwner } from "@/lib/auth";
import { countPendingReviews } from "@/lib/ordersDb";
import logoImg from "@/assets/icon/logo.png";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean; ownerOnly?: boolean };

const NAV: NavItem[] = [
  { to: "/admin",             label: "Dashboard",                    icon: LayoutDashboard, exact: true },
  { to: "/admin/products",    label: "Management Products",          icon: Flower2 },
  { to: "/admin/orders",      label: "Orders",                       icon: ClipboardList },
  { to: "/admin/reviews-mod", label: "Reviews",                      icon: Star },
  { to: "/admin/website",     label: "Management Website",           icon: Globe },
  { to: "/admin/sop",         label: "Standard Operating Procedure", icon: FileText },
  { to: "/admin/accounts",    label: "Account Management",           icon: Users, ownerOnly: true },
];

function SidebarContent({
  collapsed, setCollapsed, onClose, isMobile,
}: {
  collapsed: boolean; setCollapsed: (v: boolean) => void; onClose?: () => void; isMobile?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useAuth();
  const owner = isOwner(user);
  const visibleNav = NAV.filter((n) => !n.ownerOnly || owner);
  const [pendingReviews, setPendingReviews] = useState(0);

  useEffect(() => {
    countPendingReviews().then(setPendingReviews);
  }, [pathname]);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="relative flex items-center justify-center border-b border-[var(--asari-blush-light)] py-4 px-3">
        <Link to="/admin" onClick={onClose}>
          {collapsed && !isMobile
            ? <img src={logoImg} alt="Asari" className="h-7 w-7 object-contain" />
            : <img src={logoImg} alt="Asari Bouquet & Flower" className="h-10 w-auto object-contain" />
          }
        </Link>
        {isMobile && (
          <button onClick={onClose}
            className="absolute right-3 p-1 text-[var(--asari-charcoal)]/50 hover:text-[var(--asari-charcoal)]">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
        {visibleNav.map((n) => {
          const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
          const Icon = n.icon;
          const showBadge = n.to === "/admin/reviews-mod" && pendingReviews > 0;
          return (
            <Link key={n.to} to={n.to} onClick={onClose}
              title={n.label}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs border-l-[3px] transition-colors ${
                active
                  ? "border-[var(--asari-gold)] bg-[var(--asari-champagne)]/30 text-[var(--asari-gold)] font-medium"
                  : "border-transparent text-[var(--asari-charcoal)] hover:bg-[var(--asari-peach)]/20"
              }`}>
              <Icon className="h-4 w-4 shrink-0" />
              {(!collapsed || isMobile) && (
                <span className="truncate flex-1 text-[11px] leading-tight">{n.label}</span>
              )}
              {showBadge && (
                <span className="text-[9px] font-bold bg-amber-400 text-white rounded-full px-1.5 py-0.5 leading-none shrink-0">
                  {pendingReviews}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--asari-blush-light)] p-2 space-y-0.5">
        {user && (!collapsed || isMobile) && (
          <div className="px-2 py-1.5 text-[10px]">
            <div className="font-medium text-[var(--asari-charcoal)] truncate">{user.name}</div>
            <div className={`capitalize font-semibold ${user.role === "owner" ? "text-[var(--asari-gold)]" : "text-[var(--asari-charcoal)]/50"}`}>
              {user.role === "owner" ? "Owner" : "Staff"}
            </div>
          </div>
        )}
        <button onClick={async () => { await signOut(); onClose?.(); }}
          className="flex items-center gap-2.5 w-full px-2 py-2 text-xs rounded text-[var(--asari-charcoal)] hover:bg-[var(--asari-peach)]/20">
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          {(!collapsed || isMobile) && <span className="text-[11px]">Sign out</span>}
        </button>
        {!isMobile && (
          <button onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-2.5 w-full px-2 py-2 text-xs rounded text-[var(--asari-charcoal)] hover:bg-[var(--asari-peach)]/20">
            {collapsed ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsLeft className="h-3.5 w-3.5" />}
            {!collapsed && <span className="text-[11px]">Collapse</span>}
          </button>
        )}
      </div>
    </div>
  );
}

export function AdminSidebar() {
  // Start collapsed by default — user can expand when needed
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop — w-14 collapsed, w-44 expanded */}
      <aside className={`hidden md:flex flex-col bg-white border-r border-[var(--asari-blush-light)] transition-all duration-200 ${collapsed ? "w-14" : "w-44"}`}>
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md border border-[var(--asari-blush-light)] text-[var(--asari-charcoal)]">
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl border-r border-[var(--asari-blush-light)] transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent collapsed={false} setCollapsed={setCollapsed} onClose={() => setMobileOpen(false)} isMobile />
      </aside>
    </>
  );
}
