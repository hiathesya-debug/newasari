import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, MapPin, Settings as SettingsIcon } from "lucide-react";

export const Route = createFileRoute("/account/")({
  head: () => ({ meta: [{ title: "Account — Asari" }] }),
  component: AccountIndex,
});

function AccountIndex() {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <Card to="/account/orders" icon={<Package className="h-6 w-6" />} title="My Orders" desc="Lihat riwayat & status pesanan Anda." />
      <Card to="/account" icon={<MapPin className="h-6 w-6" />} title="Saved Addresses" desc="Atur alamat pengiriman favorit (segera)." />
      <Card to="/account" icon={<SettingsIcon className="h-6 w-6" />} title="Account Settings" desc="Perbarui profil dan kata sandi." />
    </div>
  );
}

function Card({ to, icon, title, desc }: { to: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="block bg-white rounded-lg border border-[var(--asari-blush-light)] p-6 hover:shadow-sm transition-shadow"
    >
      <div className="text-[var(--asari-gold)] mb-3">{icon}</div>
      <h3 className="font-display text-xl mb-1">{title}</h3>
      <p className="text-sm text-[var(--asari-charcoal)]/70">{desc}</p>
    </Link>
  );
}
