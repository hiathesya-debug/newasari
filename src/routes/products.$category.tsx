import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/CustomerLayout";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, CATEGORY_SLUGS, PRODUCTS, SLUG_TO_CATEGORY } from "@/lib/mockData";

export const Route = createFileRoute("/products/$category")({
  head: ({ params }) => {
    const cat = SLUG_TO_CATEGORY[params.category];
    const title = cat ? `${cat} — Asari Bouquet & Flower` : "Products — Asari";
    return {
      meta: [
        { title },
        { name: "description", content: cat ? `Koleksi ${cat} dari Asari Bouquet & Flower.` : "" },
      ],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-4xl mb-4">Kategori tidak ditemukan</h1>
        <Link to="/products" className="text-[var(--asari-gold)] underline">
          Lihat semua produk
        </Link>
      </div>
    </CustomerLayout>
  ),
});

function CategoryPage() {
  const { category } = Route.useParams();
  const cat = SLUG_TO_CATEGORY[category];
  if (!cat) throw notFound();
  const items = PRODUCTS.filter((p) => p.category === cat);

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="font-display text-5xl text-center mb-10">{cat}</h1>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Link to="/products" className="text-xs uppercase tracking-widest px-4 py-2 rounded-full border border-[var(--asari-blush-light)] hover:text-[var(--asari-gold)] hover:border-[var(--asari-gold)] transition-colors">
            All
          </Link>
          {CATEGORIES.map((c) => {
            const slug = CATEGORY_SLUGS[c];
            const active = slug === category;
            return (
              <Link
                key={c}
                to="/products/$category"
                params={{ category: slug }}
                className={`text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-colors ${
                  active
                    ? "bg-[var(--asari-gold)] text-white border-[var(--asari-gold)]"
                    : "text-[var(--asari-charcoal)] border-[var(--asari-blush-light)] hover:border-[var(--asari-gold)] hover:text-[var(--asari-gold)]"
                }`}
              >
                {c}
              </Link>
            );
          })}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </CustomerLayout>
  );
}
