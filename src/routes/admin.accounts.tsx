import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UserPlus, Pencil, Power, RotateCcw, X, Check, Loader2, ShieldCheck, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, isOwner } from "@/lib/auth";

export const Route = createFileRoute("/admin/accounts")({
  head: () => ({ meta: [{ title: "Account Management — Asari Admin" }] }),
  component: AccountsPage,
});

type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "staff";
  isActive: boolean;
  mustChangePassword: boolean;
};

type Toast = { id: number; msg: string; ok: boolean };

function Toasts({ list, dismiss }: { list: Toast[]; dismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {list.map((t) => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm text-white ${t.ok ? "bg-emerald-600" : "bg-red-600"}`}>
          {t.ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          {t.msg}
          <button onClick={() => dismiss(t.id)} className="ml-2 opacity-70 hover:opacity-100">✕</button>
        </div>
      ))}
    </div>
  );
}

function RoleBadge({ role }: { role: "owner" | "staff" }) {
  return role === "owner"
    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--asari-gold)]/20 text-[var(--asari-gold)]"><ShieldCheck className="h-3 w-3" />Owner</span>
    : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--asari-charcoal)]/10 text-[var(--asari-charcoal)]/60"><Shield className="h-3 w-3" />Staff</span>;
}

function ConfirmDialog({ msg, onConfirm, onCancel }: { msg: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
        <p className="text-sm text-[var(--asari-charcoal)] mb-5">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-[var(--asari-blush-light)] rounded-lg py-2 text-sm text-[var(--asari-charcoal)] hover:bg-[var(--asari-peach)]/20">Batal</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm hover:bg-red-700">Ya, Nonaktifkan</button>
        </div>
      </div>
    </div>
  );
}

function AddAccountModal({ onClose, onSaved, toast }: {
  onClose: () => void; onSaved: () => void; toast: (msg: string, ok?: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"owner" | "staff">("staff");
  const [password, setPassword] = useState("");
  const [mustChange, setMustChange] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !password) { setErr("Semua field harus diisi."); return; }
    setSaving(true); setErr("");
    try {
      // 1. Buat user di Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      });
      if (error || !data.user) { setErr(error?.message ?? "Gagal membuat akun."); setSaving(false); return; }
      const uid = data.user.id;

      // 2. Update profile
      await (supabase as any)
        .from("profiles")
        .upsert({ id: uid, full_name: name, is_active: true, must_change_password: mustChange });

      // 3. Insert role
      await (supabase as any)
        .from("user_roles")
        .upsert({ user_id: uid, role }, { onConflict: "user_id" });

      toast("Akun berhasil dibuat.", true);
      onSaved();
      onClose();
    } catch (e: any) {
      setErr(e.message ?? "Error tidak diketahui.");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-[var(--asari-charcoal)]">Tambah Akun Admin</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-[var(--asari-charcoal)]/40 hover:text-[var(--asari-charcoal)]" /></button>
        </div>

        {[
          { label: "Nama Lengkap", value: name, set: setName, type: "text", placeholder: "Siti Nurhaliza" },
          { label: "Email", value: email, set: setEmail, type: "email", placeholder: "staff@asari.id" },
          { label: "Password Sementara", value: password, set: setPassword, type: "password", placeholder: "Min. 6 karakter" },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-xs uppercase tracking-widest text-[var(--asari-charcoal)] mb-1">{f.label}</label>
            <input type={f.type} value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder}
              className="w-full border border-[var(--asari-blush-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--asari-gold)]" />
          </div>
        ))}

        <div>
          <label className="block text-xs uppercase tracking-widest text-[var(--asari-charcoal)] mb-2">Role</label>
          <div className="flex gap-4">
            {(["staff", "owner"] as const).map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={r} checked={role === r} onChange={() => setRole(r)} className="accent-[var(--asari-gold)]" />
                <span className="text-sm capitalize">{r}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={mustChange} onChange={(e) => setMustChange(e.target.checked)} className="accent-[var(--asari-gold)]" />
          <span className="text-sm text-[var(--asari-charcoal)]">Wajib ganti password saat login pertama</span>
        </label>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button onClick={handleSubmit} disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-[var(--asari-gold)] text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-60">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Menyimpan..." : "Buat Akun"}
        </button>
      </div>
    </div>
  );
}

function EditRoleModal({ account, currentUserId, onClose, onSaved, toast }: {
  account: AdminAccount; currentUserId: string; onClose: () => void;
  onSaved: () => void; toast: (msg: string, ok?: boolean) => void;
}) {
  const [role, setRole] = useState<"owner" | "staff">(account.role);
  const [saving, setSaving] = useState(false);
  const isSelf = account.id === currentUserId;

  const handleSave = async () => {
    if (isSelf && role !== "owner") { toast("Tidak bisa downgrade role sendiri.", false); return; }
    setSaving(true);
    try {
      await (supabase as any).from("user_roles").upsert({ user_id: account.id, role }, { onConflict: "user_id" });
      toast("Role berhasil diperbarui.", true);
      onSaved(); onClose();
    } catch { toast("Gagal menyimpan.", false); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Edit Akun</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-[var(--asari-charcoal)]/40" /></button>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[var(--asari-charcoal)] mb-1">Nama</label>
          <p className="text-sm font-medium">{account.name}</p>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[var(--asari-charcoal)] mb-1">Email (tidak bisa diubah)</label>
          <p className="text-sm text-[var(--asari-charcoal)]/50">{account.email}</p>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[var(--asari-charcoal)] mb-2">Role</label>
          <div className="flex gap-4">
            {(["staff", "owner"] as const).map((r) => (
              <label key={r} className={`flex items-center gap-2 cursor-pointer ${isSelf && r === "staff" ? "opacity-40" : ""}`}>
                <input type="radio" value={r} checked={role === r} onChange={() => setRole(r)}
                  disabled={isSelf && r === "staff"} className="accent-[var(--asari-gold)]" />
                <span className="text-sm capitalize">{r}</span>
              </label>
            ))}
          </div>
          {isSelf && <p className="text-xs text-amber-500 mt-1">Tidak bisa downgrade role sendiri.</p>}
        </div>
        <div>
          <button onClick={async () => {
            await supabase.auth.resetPasswordForEmail(account.email, { redirectTo: `${window.location.origin}/admin/login` });
            toast("Email reset password terkirim.", true);
          }} className="text-xs text-[var(--asari-gold)] hover:underline flex items-center gap-1">
            <RotateCcw className="h-3 w-3" /> Kirim Reset Password
          </button>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-[var(--asari-gold)] text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-60">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}

function AccountsPage() {
  const user = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminAccount | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<AdminAccount | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Guard: owner only
  useEffect(() => {
    if (user && !isOwner(user)) navigate({ to: "/admin" });
  }, [user, navigate]);

  const toast = (msg: string, ok = true) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, ok }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  };

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const { data: roles } = await (supabase as any)
        .from("user_roles")
        .select("user_id, role")
        .in("role", ["owner", "staff"]);

      const ids = (roles ?? []).map((r: any) => r.user_id);
      if (!ids.length) { setAccounts([]); setLoading(false); return; }

      const { data: profiles } = await (supabase as any)
        .from("profiles")
        .select("id, full_name, is_active, must_change_password")
        .in("id", ids);

      const profileMap = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p]));

      const { data: { users } } = await supabase.auth.admin.listUsers();
      const emailMap = Object.fromEntries((users ?? []).map((u: any) => [u.id, u.email]));

      setAccounts((roles ?? []).map((r: any) => {
        const p = profileMap[r.user_id] ?? {};
        return {
          id: r.user_id,
          name: p.full_name ?? "—",
          email: emailMap[r.user_id] ?? "—",
          role: r.role,
          isActive: p.is_active ?? true,
          mustChangePassword: p.must_change_password ?? false,
        };
      }));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { if (isOwner(user)) loadAccounts(); }, [user]);

  const toggleActive = async (account: AdminAccount) => {
    if (account.id === user?.id) { toast("Tidak bisa nonaktifkan akun sendiri.", false); return; }
    try {
      await (supabase as any).from("profiles").update({ is_active: !account.isActive }).eq("id", account.id);
      toast(account.isActive ? `${account.name} dinonaktifkan.` : `${account.name} diaktifkan.`);
      loadAccounts();
    } catch { toast("Gagal mengubah status.", false); }
  };

  if (!isOwner(user)) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">Account Management</h1>
          <p className="text-sm text-[var(--asari-charcoal)]/60 mt-1">Kelola akun admin Owner dan Staff.</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[var(--asari-gold)] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[var(--asari-gold-light)] whitespace-nowrap">
          <UserPlus className="h-4 w-4" /> Tambah Akun
        </button>
      </div>
      <div className="h-px bg-[var(--asari-gold)]" />

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[var(--asari-charcoal)]/60 py-8 justify-center">
          <Loader2 className="h-4 w-4 animate-spin" /> Memuat akun...
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--asari-blush-light)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--asari-blush-light)] text-left">
                {["Nama", "Email", "Role", "Status", "Aksi"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs uppercase tracking-widest text-[var(--asari-charcoal)]/50 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="border-b border-[var(--asari-blush-light)]/60 hover:bg-[var(--asari-champagne)]/10">
                  <td className="px-4 py-3 font-medium">
                    {a.name}
                    {a.id === user?.id && <span className="ml-2 text-[10px] text-[var(--asari-gold)] border border-[var(--asari-gold)] px-1.5 py-0.5 rounded-full">Kamu</span>}
                    {a.mustChangePassword && <span className="ml-2 text-[10px] text-amber-600 border border-amber-300 px-1.5 py-0.5 rounded-full">Harus ganti password</span>}
                  </td>
                  <td className="px-4 py-3 text-[var(--asari-charcoal)]/60">{a.email}</td>
                  <td className="px-4 py-3"><RoleBadge role={a.role} /></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${a.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {a.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditTarget(a)} title="Edit" className="p-1.5 rounded hover:bg-[var(--asari-champagne)]/30 text-[var(--asari-charcoal)]/60 hover:text-[var(--asari-gold)]">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => a.id === user?.id ? toast("Tidak bisa nonaktifkan akun sendiri.", false) : setDeactivateTarget(a)}
                        title={a.isActive ? "Nonaktifkan" : "Aktifkan"}
                        className={`p-1.5 rounded hover:bg-[var(--asari-champagne)]/30 ${a.isActive ? "text-red-400 hover:text-red-600" : "text-green-500 hover:text-green-700"}`}
                      >
                        <Power className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!accounts.length && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[var(--asari-charcoal)]/40">Belum ada akun admin.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && <AddAccountModal onClose={() => setShowAdd(false)} onSaved={loadAccounts} toast={toast} />}
      {editTarget && <EditRoleModal account={editTarget} currentUserId={user!.id} onClose={() => setEditTarget(null)} onSaved={loadAccounts} toast={toast} />}
      {deactivateTarget && (
        <ConfirmDialog
          msg={`Nonaktifkan akun ${deactivateTarget.name}? Mereka tidak akan bisa login lagi.`}
          onConfirm={async () => { await toggleActive(deactivateTarget); setDeactivateTarget(null); }}
          onCancel={() => setDeactivateTarget(null)}
        />
      )}
      <Toasts list={toasts} dismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
}