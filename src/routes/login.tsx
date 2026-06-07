import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { signInCustomer } from "@/lib/auth";
import { CustomerLayout } from "@/components/CustomerLayout";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — Asari" }] }),
  component: CustomerLoginPage,
});

function CustomerLoginPage() {
  const navigate = useNavigate();
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signInCustomer(whatsapp, password);
    setLoading(false);
    if (!res.user) {
      setError(res.error ?? "Login gagal.");
      return;
    }
    navigate({ to: "/account" });
  };

  return (
    <CustomerLayout>
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white rounded-lg shadow-sm border border-[var(--asari-blush-light)] p-8">
          <h1 className="font-display text-3xl text-center mb-2">Sign In to Your Account</h1>
          <p className="text-center text-sm text-[var(--asari-coral)] mb-6">
            Selamat datang kembali di Asari
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-widest">Nomor WhatsApp</span>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="mt-1 w-full border border-[var(--asari-blush-light)] rounded px-3 py-2 focus:outline-none focus:border-[var(--asari-gold)]"
                placeholder="+62 812-3456-7890"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-[var(--asari-blush-light)] rounded px-3 py-2 focus:outline-none focus:border-[var(--asari-gold)]"
                placeholder="••••••••"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--asari-gold)] text-white py-2.5 rounded uppercase text-xs tracking-widest hover:bg-[var(--asari-gold-light)] disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Sign In"}
            </button>
          </form>
          <div className="mt-6 text-sm text-center space-y-2">
            <p>
              Belum punya akun?{" "}
              <Link to="/signup" className="text-[var(--asari-gold)] underline">
                Daftar di sini
              </Link>
            </p>
            <p className="text-xs text-[var(--asari-charcoal)]/60">
              <Link to="/">Lanjutkan tanpa masuk →</Link>
            </p>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
