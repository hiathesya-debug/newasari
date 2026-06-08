import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Flower2, ClipboardList, Globe, FileText,
<<<<<<< HEAD
  ChevronsLeft, ChevronsRight, LogOut, Users, Menu, X,
} from "lucide-react";
import { signOut, useAuth, isOwner } from "@/lib/auth";
import logoImg from "@/assets/icon/logo.png";
=======
  ChevronsLeft, ChevronsRight, LogOut, Users,
} from "lucide-react";
import { signOut, useAuth, isOwner } from "@/lib/auth";
>>>>>>> d1c0379adb199bda33f20b84dd044026a97230ed

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean; ownerOnly?: boolean };

const NAV: NavItem[] = [
<<<<<<< HEAD
  { to: "/admin",          label: "Dashboard",                    icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Management Products",          icon: Flower2 },
  { to: "/admin/orders",   label: "Orders",                       icon: ClipboardList },
  { to: "/admin/website",  label: "Management Website",           icon: Globe },
  { to: "/admin/sop",      label: "Standard Operating Procedure", icon: FileText },
  { to: "/admin/accounts", label: "Account Management",           icon: Users, ownerOnly: true },
=======
  { to: "/admin",          label: "Dashboard",                   icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Management Products",         icon: Flower2 },
  { to: "/admin/orders",   label: "Orders",                      icon: ClipboardList },
  { to: "/admin/website",  label: "Management Website",          icon: Globe },
  { to: "/admin/sop",      label: "Standard Operating Procedure",icon: FileText },
  { to: "/admin/accounts", label: "Account Management",          icon: Users, ownerOnly: true },
>>>>>>> d1c0379adb199bda33f20b84dd044026a97230ed
];

function SidebarContent({
  collapsed, setCollapsed, onClose, isMobile,
}: {
  collapsed: boolean; setCollapsed: (v: boolean) => void; onClose?: () => void; isMobile?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useAuth();
  const owner = isOwner(user);
<<<<<<< HEAD
  const visibleNav = NAV.filter((n) => !n.ownerOnly || owner);

  return (
    <div className="flex flex-col h-full">
      {/* Logo — always centered */}
      <div className="relative flex items-center justify-center border-b border-[var(--asari-blush-light)] py-5 px-4">
        <Link to="/admin" onClick={onClose}>
          {collapsed && !isMobile
            ? <img src={logoImg} alt="Asari" className="h-8 w-8 object-contain" />
            : <img src={logoImg} alt="Asari Bouquet & Flower" className="h-12 w-auto object-contain" />
          }
=======

  const visibleNav = NAV.filter((n) => !n.ownerOnly || owner);

  return (
    <aside className={`hidden md:flex flex-col bg-white border-r border-[var(--asari-blush-light)] transition-all duration-200 ${collapsed ? "w-16" : "w-56"}`}>
      <div className={`flex flex-col items-center py-6 border-b border-[var(--asari-blush-light)] ${collapsed ? "px-2" : "px-4"}`}>
        <Link to="/admin" className="flex flex-col items-center leading-none">
          <span className="font-display italic text-3xl text-[var(--asari-gold)]">Asari</span>
          {!collapsed && (
            <span className="text-[9px] tracking-[0.3em] uppercase text-[var(--asari-charcoal)] mt-1">
              bouquet &amp; flower
            </span>
          )}
>>>>>>> d1c0379adb199bda33f20b84dd044026a97230ed
        </Link>
        {isMobile && (
          <button onClick={onClose}
            className="absolute right-3 p-1 text-[var(--asari-charcoal)]/50 hover:text-[var(--asari-charcoal)]">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

<<<<<<< HEAD
      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
=======
      <nav className="flex-1 py-4 space-y-1">
>>>>>>> d1c0379adb199bda33f20b84dd044026a97230ed
        {visibleNav.map((n) => {
          const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
          const Icon = n.icon;
          return (
<<<<<<< HEAD
            <Link key={n.to} to={n.to} onClick={onClose}
              title={collapsed && !isMobile ? n.label : undefined}
=======
            <Link key={n.to} to={n.to} title={collapsed ? n.label : undefined}
>>>>>>> d1c0379adb199bda33f20b84dd044026a97230ed
              className={`flex items-center gap-3 px-4 py-2.5 text-sm border-l-[3px] transition-colors ${
                active
                  ? "border-[var(--asari-gold)] bg-[var(--asari-champagne)]/30 text-[var(--asari-gold)] font-medium"
                  : "border-transparent text-[var(--asari-charcoal)] hover:bg-[var(--asari-peach)]/20"
              }`}>
              <Icon className="h-5 w-5 shrink-0" />
              {(!collapsed || isMobile) && <span className="truncate">{n.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--asari-blush-light)] p-3 space-y-1">
        {user && (!collapsed || isMobile) && (
          <div className="px-2 py-2 text-xs">
            <div className="font-medium text-[var(--asari-charcoal)] truncate">{user.name}</div>
            <div className={`capitalize font-semibold ${user.role === "owner" ? "text-[var(--asari-gold)]" : "text-[var(--asari-charcoal)]/50"}`}>
              {user.role === "owner" ? "Owner" : "Staff"}
            </div>
          </div>
        )}
<<<<<<< HEAD
        <button onClick={async () => { await signOut(); onClose?.(); }}
          className="flex items-center gap-3 w-full px-2 py-2 text-sm rounded text-[var(--asari-charcoal)] hover:bg-[var(--asari-peach)]/20">
          <LogOut className="h-4 w-4 shrink-0" />
          {(!collapsed || isMobile) && <span>Sign out</span>}
=======
        <button onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-2 py-2 text-sm rounded text-[var(--asari-charcoal)] hover:bg-[var(--asari-peach)]/20"
          title="Sign out">
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
        <button onClick={() => setCollapsed((v) => !v)}
          className="flex items-center gap-3 w-full px-2 py-2 text-sm rounded text-[var(--asari-charcoal)] hover:bg-[var(--asari-peach)]/20">
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
>>>>>>> d1c0379adb199bda33f20b84dd044026a97230ed
        </button>
        {!isMobile && (
          <button onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 w-full px-2 py-2 text-sm rounded text-[var(--asari-charcoal)] hover:bg-[var(--asari-peach)]/20">
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        )}
      </div>
    </div>
  );
<<<<<<< HEAD
}

export function AdminSidebar() {
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
      {/* Desktop */}
      <aside className={`hidden md:flex flex-col bg-white border-r border-[var(--asari-blush-light)] transition-all duration-200 ${collapsed ? "w-16" : "w-56"}`}>
        <SidebarContent collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md border border-[var(--asari-blush-light)] text-[var(--asari-charcoal)]">
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`md:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl border-r border-[var(--asari-blush-light)] transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent collapsed={false} setCollapsed={setCollapsed} onClose={() => setMobileOpen(false)} isMobile />
      </aside>
    </>
  );
=======
>>>>>>> d1c0379adb199bda33f20b84dd044026a97230ed
}