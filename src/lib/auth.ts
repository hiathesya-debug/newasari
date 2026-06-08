import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Role = "owner" | "staff" | "customer";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  whatsapp?: string | null;
  mustChangePassword?: boolean;
};

const STORAGE_KEY = "asari_user_cache";

export function waToEmail(wa: string): string {
  const digits = wa.replace(/\D/g, "");
  return `wa${digits}@asari.local`;
}

async function loadUserContext(userId: string, email: string): Promise<AdminUser | null> {
  try {
    const [profileRes, rolesRes] = await Promise.all([
      (supabase as any).from("profiles").select("full_name, whatsapp, is_active, must_change_password").eq("id", userId).maybeSingle(),
      (supabase as any).from("user_roles").select("role").eq("user_id", userId),
    ]);

    const profile = profileRes.data;
    const roles = rolesRes.data ?? [];

    // Check if account is active
    if (profile && profile.is_active === false) return null;

    // Map DB roles to app roles
    // 'admin' and 'owner' both map to owner role
    const hasOwner = roles.some((r: any) => r.role === "owner" || r.role === "admin");
    const hasStaff = roles.some((r: any) => r.role === "staff");

    const role: Role = hasOwner ? "owner" : hasStaff ? "staff" : "customer";

    return {
      id: userId,
      email,
      name: profile?.full_name || email,
      whatsapp: profile?.whatsapp ?? null,
      role,
      mustChangePassword: profile?.must_change_password ?? false,
    };
  } catch {
    return null;
  }
}

const listeners = new Set<() => void>();
let cached: AdminUser | null = null;
let initialised = false;

function persistCache(u: AdminUser | null) {
  cached = u;
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  else localStorage.removeItem(STORAGE_KEY);
  listeners.forEach((l) => l());
}

function readCache(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

async function refreshFromSession() {
  try {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session?.user) { persistCache(null); return; }
    const ctx = await loadUserContext(session.user.id, session.user.email ?? "");
    persistCache(ctx);
  } catch {
    persistCache(null);
  }
}

if (typeof window !== "undefined") {
  cached = readCache();
  if (!initialised) {
    initialised = true;
    supabase.auth.onAuthStateChange((event: string) => {
      if (event === "SIGNED_OUT") persistCache(null);
      else if (["SIGNED_IN", "TOKEN_REFRESHED", "USER_UPDATED", "INITIAL_SESSION"].includes(event))
        void refreshFromSession();
    });
    void refreshFromSession();
  }
}

export function getCurrentUser(): AdminUser | null { return cached; }

export async function signInAdmin(email: string, password: string): Promise<{ user: AdminUser | null; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return { user: null, error: error?.message ?? "Login gagal." };
    const ctx = await loadUserContext(data.user.id, data.user.email ?? email);
    if (!ctx || ctx.role === "customer") {
      await supabase.auth.signOut();
      return { user: null, error: "Akun ini tidak memiliki akses admin." };
    }
    persistCache(ctx);
    return { user: ctx };
  } catch (e: any) {
    return { user: null, error: e.message ?? "Login gagal." };
  }
}

export async function signInCustomer(whatsapp: string, password: string): Promise<{ user: AdminUser | null; error?: string }> {
  const email = waToEmail(whatsapp);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { user: null, error: "Nomor WhatsApp atau kata sandi salah." };
  const ctx = await loadUserContext(data.user.id, data.user.email ?? email);
  persistCache(ctx);
  return { user: ctx };
}

export async function signUpCustomer(params: {
  fullName: string; whatsapp: string; password: string;
}): Promise<{ user: AdminUser | null; error?: string }> {
  const email = waToEmail(params.whatsapp);
  const { data, error } = await supabase.auth.signUp({
    email, password: params.password,
    options: {
      emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      data: { full_name: params.fullName, whatsapp: params.whatsapp.replace(/\D/g, "") },
    },
  });
  if (error || !data.user) return { user: null, error: error?.message ?? "Pendaftaran gagal." };
  const ctx = await loadUserContext(data.user.id, data.user.email ?? email);
  persistCache(ctx);
  return { user: ctx };
}

export async function signOut() {
  await supabase.auth.signOut();
  persistCache(null);
}

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(() => cached ?? readCache());
  useEffect(() => {
    const update = () => setUser(cached);
    listeners.add(update);
    void refreshFromSession();
    return () => { listeners.delete(update); };
  }, []);
  return user;
}

export function isAdminRole(user: AdminUser | null): boolean {
  return !!user && (user.role === "owner" || user.role === "staff");
}

export function isOwner(user: AdminUser | null): boolean {
  return user?.role === "owner";
}

export function isStaffOrAdmin(user: AdminUser | null): boolean {
  return isAdminRole(user);
}