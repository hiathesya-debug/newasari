import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/CustomerLayout";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, CATEGORY_SLUGS, PRODUCTS } from "@/lib/mockData";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Our Products — Asari Bouquet & Flower" },
      { name: "description", content: "Jelajahi koleksi bouquet, hand bouquet, dan flower vase pilihan dari Asari Bouquet & Flower." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAll = pathname === "/products" || pathname === "/products/";

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="font-display text-5xl text-center mb-10">Our Products</h1>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <CategoryTab to="/products" label="All" active={isAll} />
          {CATEGORIES.map((c) => (
            <CategoryTab key={c} to={`/products/${CATEGORY_SLUGS[c]}`} label={c} active={false} />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </CustomerLayout>
  );
}

export function CategoryTab({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-colors ${
        active
          ? "bg-[var(--asari-gold)] text-white border-[var(--asari-gold)]"
          : "text-[var(--asari-charcoal)] border-[var(--asari-blush-light)] hover:border-[var(--asari-gold)] hover:text-[var(--asari-gold)]"
      }`}
    >
      {label}
    </Link>
  );
}
