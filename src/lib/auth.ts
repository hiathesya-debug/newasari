// Real auth using Lovable Cloud (Supabase). Backwards-compatible useAuth() API.
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Role = "admin" | "staff" | "customer";
export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  whatsapp?: string | null;
};

const STORAGE_KEY = "asari_user_cache";

// Convert WA number to a synthetic email so it can be used with Supabase email/password.
export function waToEmail(wa: string): string {
  const digits = wa.replace(/\D/g, "");
  return `wa${digits}@asari.local`;
}

async function loadUserContext(userId: string, email: string): Promise<AdminUser | null> {
  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("full_name, whatsapp").eq("id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);
  const roleList = (roles ?? []).map((r) => r.role as Role);
  const role: Role = roleList.includes("admin")
    ? "admin"
    : roleList.includes("staff")
      ? "staff"
      : "customer";
  return {
    id: userId,
    email,
    name: profile?.full_name || email,
    whatsapp: profile?.whatsapp ?? null,
    role,
  };
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
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session?.user) {
    persistCache(null);
    return;
  }
  const ctx = await loadUserContext(session.user.id, session.user.email ?? "");
  persistCache(ctx);
}

if (typeof window !== "undefined") {
  cached = readCache();
  if (!initialised) {
    initialised = true;
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        persistCache(null);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED" || event === "INITIAL_SESSION") {
        void refreshFromSession();
      }
    });
    void refreshFromSession();
  }
}

export function getCurrentUser(): AdminUser | null {
  return cached;
}

export async function signInAdmin(email: string, password: string): Promise<{ user: AdminUser | null; error?: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { user: null, error: error?.message ?? "Login gagal." };
  const ctx = await loadUserContext(data.user.id, data.user.email ?? email);
  if (!ctx || (ctx.role !== "admin" && ctx.role !== "staff")) {
    await supabase.auth.signOut();
    return { user: null, error: "Akun ini tidak memiliki akses admin." };
  }
  persistCache(ctx);
  return { user: ctx };
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
  fullName: string;
  whatsapp: string;
  password: string;
}): Promise<{ user: AdminUser | null; error?: string }> {
  const email = waToEmail(params.whatsapp);
  const { data, error } = await supabase.auth.signUp({
    email,
    password: params.password,
    options: {
      emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      data: {
        full_name: params.fullName,
        whatsapp: params.whatsapp.replace(/\D/g, ""),
      },
    },
  });
  if (error || !data.user) return { user: null, error: error?.message ?? "Pendaftaran gagal." };
  // Profile is created by the on_auth_user_created trigger.
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
    // initial pull in case cache was stale
    void refreshFromSession();
    return () => {
      listeners.delete(update);
    };
  }, []);
  return user;
}

export function isStaffOrAdmin(user: AdminUser | null): boolean {
  return !!user && (user.role === "admin" || user.role === "staff");
}
