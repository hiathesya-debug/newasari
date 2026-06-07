import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { signUpCustomer } from "@/lib/auth";
import { CustomerLayout } from "@/components/CustomerLayout";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create Account — Asari" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("Kata sandi minimal 6 karakter.");
    if (password !== confirm) return setError("Konfirmasi sandi tidak sama.");
    if (whatsapp.replace(/\D/g, "").length < 8) return setError("Nomor WhatsApp tidak valid.");
    setLoading(true);
    const res = await signUpCustomer({ fullName, whatsapp, password });
    setLoading(false);
    if (!res.user) {
      setError(res.error ?? "Pendaftaran gagal.");
      return;
    }
    navigate({ to: "/account" });
  };

  return (
    <CustomerLayout>
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white rounded-lg shadow-sm border border-[var(--asari-blush-light)] p-8">
          <h1 className="font-display text-3xl text-center mb-2">Create Account</h1>
          <p className="text-center text-sm text-[var(--asari-coral)] mb-6">
            Simpan dan lacak pesanan Anda
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input label="Nama Lengkap" value={fullName} onChange={setFullName} required />
            <Input label="Nomor WhatsApp" value={whatsapp} onChange={setWhatsapp} required placeholder="+62 812-..." type="tel" />
            <Input label="Password" value={password} onChange={setPassword} required type="password" />
            <Input label="Konfirmasi Password" value={confirm} onChange={setConfirm} required type="password" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--asari-gold)] text-white py-2.5 rounded uppercase text-xs tracking-widest hover:bg-[var(--asari-gold-light)] disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Create Account"}
            </button>
          </form>
          <p className="mt-6 text-sm text-center">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-[var(--asari-gold)] underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
}

function Input({
  label, value, onChange, type = "text", required, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-[var(--asari-blush-light)] rounded px-3 py-2 focus:outline-none focus:border-[var(--asari-gold)]"
      />
    </label>
  );
}
