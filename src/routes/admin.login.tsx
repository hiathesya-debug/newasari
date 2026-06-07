import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { signInAdmin } from "@/lib/auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Asari" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signInAdmin(email, password);
    setLoading(false);
    if (!res.user) {
      setError(res.error ?? "Login gagal.");
      return;
    }
    navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--asari-off-white)] px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-[var(--asari-blush-light)] p-8">
        <div className="flex flex-col items-center mb-8 leading-none">
          <span className="font-display italic text-4xl text-[var(--asari-gold)]">Asari</span>
          <span className="text-[10px] tracking-[0.3em] uppercase mt-1">bouquet &amp; flower</span>
        </div>
        <h1 className="font-display text-2xl text-center mb-1">Sign In as Admin</h1>
        <p className="text-xs text-center text-[var(--asari-coral)] mb-6">
          Akses internal Asari Bouquet &amp; Flower
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-widest">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-[var(--asari-blush-light)] rounded px-3 py-2 focus:outline-none focus:border-[var(--asari-gold)]"
              placeholder="owner@asari.id"
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
            {loading ? "Memproses..." : "Sign In as Admin"}
          </button>
        </form>
        <div className="mt-6 text-[11px] text-center text-[var(--asari-charcoal)]/60">
          Belum punya akun admin? Hubungi pemilik atau jalankan{" "}
          <Link to="/" className="underline">setup awal</Link>.
        </div>
      </div>
    </div>
  );
}
