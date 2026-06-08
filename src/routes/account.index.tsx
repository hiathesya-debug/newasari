import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Check, X, Loader2, User, Phone } from "lucide-react";

export const Route = createFileRoute("/account/")({
  head: () => ({ meta: [{ title: "My Profile — Asari" }] }),
  component: MyProfile,
});

function MyProfile() {
  const user = useAuth();

  // Edit nama
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name ?? "");
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState("");

  // Ganti password
  const [editingPassword, setEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setSavingName(true);
    setNameMsg("");
    try {
      const { error } = await (supabase as any)
        .from("profiles")
        .update({ full_name: nameInput.trim() })
        .eq("id", user?.id);
      if (error) throw error;
      setNameMsg("Nama berhasil diperbarui!");
      setEditingName(false);
    } catch {
      setNameMsg("Gagal menyimpan. Coba lagi.");
    }
    setSavingName(false);
  };

  const handleSavePassword = async () => {
    if (newPassword.length < 6) { setPasswordMsg("Password minimal 6 karakter."); return; }
    if (newPassword !== confirmPassword) { setPasswordMsg("Password tidak cocok."); return; }
    setSavingPassword(true);
    setPasswordMsg("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMsg("Gagal: " + error.message);
    } else {
      setPasswordMsg("Password berhasil diganti!");
      setEditingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
    }
    setSavingPassword(false);
  };

  // Nomor WA: ambil dari profile atau parse dari email (wa628xxx@asari.local)
  const waRaw = user?.whatsapp
    ?? user?.email?.replace(/^wa/, "").replace(/@asari\.local$/, "") ?? "";
  const whatsapp = waRaw ? `+${waRaw}` : "—";

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="font-display text-2xl">My Profile</h2>

      {/* Info Card */}
      <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6 space-y-5">
        {/* Nama */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs uppercase tracking-widest text-[var(--asari-charcoal)]/60 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Nama
            </label>
            {!editingName && (
              <button
                onClick={() => { setNameInput(user?.name ?? ""); setEditingName(true); setNameMsg(""); }}
                className="text-[var(--asari-gold)] hover:opacity-70"
                title="Edit nama"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {editingName ? (
            <div className="space-y-2 mt-1">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                autoFocus
                className="w-full border border-[var(--asari-gold)] rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
              <div className="flex gap-2">
                <button onClick={handleSaveName} disabled={savingName}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--asari-gold)] text-white py-1.5 rounded-lg text-xs font-semibold disabled:opacity-60">
                  {savingName ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  Simpan
                </button>
                <button onClick={() => setEditingName(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-[var(--asari-blush-light)] py-1.5 rounded-lg text-xs">
                  <X className="h-3.5 w-3.5" /> Batal
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm font-medium text-[var(--asari-charcoal)]">{user?.name ?? "—"}</p>
          )}
          {nameMsg && (
            <p className={`text-xs mt-1 ${nameMsg.includes("Gagal") ? "text-red-500" : "text-green-600"}`}>
              {nameMsg}
            </p>
          )}
        </div>

        <div className="h-px bg-[var(--asari-blush-light)]" />

        {/* WhatsApp */}
        <div>
          <label className="text-xs uppercase tracking-widest text-[var(--asari-charcoal)]/60 flex items-center gap-1.5 mb-1">
            <Phone className="h-3.5 w-3.5" /> Nomor WhatsApp
          </label>
          <p className="text-sm font-medium text-[var(--asari-charcoal)]">{whatsapp}</p>
          <p className="text-[11px] text-[var(--asari-charcoal)]/40 mt-0.5">Nomor WA digunakan sebagai login dan tidak dapat diubah.</p>
        </div>
      </div>

      {/* Ganti Password */}
      <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--asari-charcoal)]">
            Ganti Password
          </h3>
          {!editingPassword && (
            <button
              onClick={() => { setEditingPassword(true); setPasswordMsg(""); }}
              className="text-xs text-[var(--asari-gold)] hover:underline"
            >
              Ubah
            </button>
          )}
        </div>

        {editingPassword ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[var(--asari-charcoal)]/60 mb-1 block">Password Baru</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 karakter"
                className="w-full border border-[var(--asari-blush-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--asari-gold)]" />
            </div>
            <div>
              <label className="text-xs text-[var(--asari-charcoal)]/60 mb-1 block">Konfirmasi Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
                className="w-full border border-[var(--asari-blush-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--asari-gold)]" />
            </div>
            {passwordMsg && (
              <p className={`text-xs ${
                passwordMsg.includes("Gagal") || passwordMsg.includes("minimal") || passwordMsg.includes("cocok")
                  ? "text-red-500" : "text-green-600"
              }`}>{passwordMsg}</p>
            )}
            <div className="flex gap-2">
              <button onClick={handleSavePassword} disabled={savingPassword}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--asari-gold)] text-white py-2 rounded-lg text-xs font-semibold disabled:opacity-60">
                {savingPassword ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                Simpan Password
              </button>
              <button
                onClick={() => { setEditingPassword(false); setNewPassword(""); setConfirmPassword(""); setPasswordMsg(""); }}
                className="flex-1 flex items-center justify-center gap-1.5 border border-[var(--asari-blush-light)] py-2 rounded-lg text-xs">
                <X className="h-3.5 w-3.5" /> Batal
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[var(--asari-charcoal)]/40 tracking-widest">••••••••</p>
        )}
      </div>
    </div>
  );
}