import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CustomerLayout } from "@/components/CustomerLayout";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, CATEGORY_SLUGS, PRODUCTS } from "@/lib/mockData";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
});

function getInitialCategory() {
  if (typeof window === "undefined") return "all";
  return new URLSearchParams(window.location.search).get("category") ?? "all";
}

function ProductsPage() {
  const [active, setActive] = useState(getInitialCategory);

  useEffect(() => {
    const onPop = () => setActive(getInitialCategory());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function handleTab(slug: string) {
    setActive(slug);
    const url = slug === "all" ? "/products" : "/products?category=" + slug;
    window.history.pushState({}, "", url);
  }

  const filtered =
    active === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => CATEGORY_SLUGS[p.category] === active);

  const tabClass = (slug: string) =>
    "text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-colors duration-200 " +
    (active === slug
      ? "bg-[#D9A84E] text-white border-[#D9A84E]"
      : "text-[var(--asari-charcoal)] border-[var(--asari-blush-light)] hover:border-[#D9A84E] hover:text-[#D9A84E]");

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="font-display text-5xl text-center mb-10">Our Products</h1>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button onClick={() => handleTab("all")} className={tabClass("all")}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => handleTab(CATEGORY_SLUGS[c])}
              className={tabClass(CATEGORY_SLUGS[c])}
            >
              {c}
            </button>
          ))}
          {/* Custom Order tab */}
          <button onClick={() => handleTab("custom-order")} className={tabClass("custom-order")}>
            Custom
          </button>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div
            key={"empty-" + active}
            className="flex flex-col items-center justify-center py-24 text-center"
            style={{ minHeight: "400px" }}
          >
            <span className="text-5xl mb-5">🌸</span>
            <p className="font-body text-sm text-[var(--asari-charcoal)]">
              No products available in this category right now.
            </p>
          </div>
        ) : (
          <div
            key={active}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            style={{ minHeight: "400px", animation: "asariFadeIn 0.15s ease both" }}
          >
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes asariFadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </CustomerLayout>
  );
}
