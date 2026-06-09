import { createFileRoute, Link } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/CustomerLayout";
import { ProductCard } from "@/components/ProductCard";
import { SectionTitle, Divider } from "@/components/SectionBits";
import { CATEGORIES, CATEGORY_SLUGS, PRODUCTS } from "@/lib/mockData";
import heroImg from "@/assets/hero-floral.jpg";
import customProductImage from "@/assets/products/custom product.png";
import { useEffect, useState } from "react";
import { listApprovedReviews, type ReviewRow } from "@/lib/reviews";
import { timeAgo } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asari Bouquet & Flower — Florist Antapani Bandung" },
      { name: "description", content: "Florist rumahan di Antapani Bandung. Bouquet, hand bouquet, dan flower vase yang dirangkai dengan tangan untuk momen istimewa." },
      { property: "og:title", content: "Asari Bouquet & Flower" },
      { property: "og:description", content: "Florist rumahan di Antapani Bandung." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Home,
});

function Home() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);

  useEffect(() => {
    // Fetch approved reviews when the homepage loads
    listApprovedReviews().then(setReviews);
  }, []);

  const WA_CUSTOM = "https://wa.me/6287863912739?text=" +
    encodeURIComponent("Halo Asari! Saya ingin membuat custom order. Boleh minta info lebih lanjut?");

  return (
    <CustomerLayout>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Asari floral arrangement"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(217,168,78,0.25) 0%, rgba(140,119,94,0.45) 100%)",
          }}
        />
        <div className="relative h-full flex items-center justify-center">
          <h1 className="font-display italic text-white text-5xl md:text-7xl drop-shadow-lg text-center px-4">
            Asari Bouquet &amp; Flower
          </h1>
        </div>
      </section>

      {/* Product sections — 4 flower categories */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {CATEGORIES.map((cat, idx) => {
          const items = PRODUCTS.filter((p) => p.category === cat).slice(0, 4);
          const slug = CATEGORY_SLUGS[cat];
          return (
            <div key={cat}>
              <SectionTitle>
                {cat === "Freshest Series" ? "Our Freshest Series" : cat}
              </SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="flex justify-center mt-10">
                <a
                  href={"/products?category=" + slug}
                  className="border border-[var(--asari-gold)] text-[var(--asari-gold)] text-xs uppercase tracking-[0.25em] px-6 py-3 hover:bg-[var(--asari-gold)] hover:text-white transition-colors"
                >
                  View All Products
                </a>
              </div>
              {idx < CATEGORIES.length - 1 && <Divider />}
            </div>
          );
        })}

        {/* Custom Order banner */}
        <Divider />
        <div className="relative overflow-hidden rounded-sm" style={{ minHeight: "320px" }}>
          {/* Background image */}
          <img
            src={customProductImage}
            alt="Custom Order"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Warm overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(38,22,14,0.58)" }}
          />
          {/* Content */}
          <div className="relative flex flex-col items-center justify-center text-center px-6 py-20 h-full gap-4">
            <p
              className="font-body text-xs uppercase tracking-[0.3em] mb-2"
              style={{ color: "#D9A84E" }}
            >
              Dibuat Khusus &amp; Personal
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-white leading-tight">
              Custom Order
            </h2>
            
            {/* Bilingual Paragraph text */}
            <div className="flex flex-col items-center gap-1 mt-2">
              <p className="font-body text-white/95 text-[15px] max-w-md leading-relaxed">
                Wujudkan ide Anda — kami yang akan merangkainya.
              </p>
              <p className="font-body text-white/60 text-[13px] italic max-w-md leading-relaxed">
                Bring your idea to life — we&apos;ll wrap it.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-5">
              <a
                href={WA_CUSTOM}
                target="_blank"
                rel="noreferrer"
                className="font-body font-semibold text-xs uppercase tracking-widest px-6 py-3 text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: "#D9A84E" }}
              >
                Tanya Owner
              </a>
              <a
                href="/products?category=custom-order"
                className="font-body font-semibold text-xs uppercase tracking-widest px-6 py-3 text-white border border-white/60 hover:bg-white/10 transition-colors"
              >
                Lihat Produk Custom
              </a>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <>
            <Divider />
            <div className="py-10">
              <SectionTitle>What They Say</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reviews.slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-5 flex flex-col h-full"
                  >
                    <div className="flex-1 min-w-0 mb-3">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-medium text-sm text-[var(--asari-charcoal)]">
                          {r.is_anonymous ? "Anonim" : r.name ?? "—"}
                        </span>
                        {r.product_name && (
                          <span className="text-[10px] uppercase tracking-widest bg-[var(--asari-peach)]/30 text-[var(--asari-charcoal)] px-2 py-0.5 rounded-full truncate max-w-[120px]">
                            {r.product_name}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[var(--asari-charcoal)]/80 leading-relaxed line-clamp-4">
                        {r.review_text}
                      </p>
                    </div>
                    <p className="text-[11px] text-[var(--asari-charcoal)]/40 mt-auto">
                      {timeAgo(new Date(r.created_at))}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-10">
                <Link
                  to="/reviews"
                  className="border border-[var(--asari-gold)] text-[var(--asari-gold)] text-xs uppercase tracking-[0.25em] px-6 py-3 hover:bg-[var(--asari-gold)] hover:text-white transition-colors"
                >
                  View All Reviews
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* About */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-4xl md:text-5xl text-[var(--asari-gold)] mb-8">
          Asari Bouquet &amp; Flower
        </h2>
        <p className="text-[var(--asari-charcoal)] leading-relaxed mb-6">
          Asari adalah florist rumahan yang lahir dari kecintaan kami pada bunga dan keindahan
          momen kecil. Berbasis di Antapani, Bandung, kami merangkai setiap bouquet dengan tangan,
          memilih bunga segar setiap hari, dan memperhatikan setiap detail agar terasa istimewa.
        </p>
        <p className="text-[var(--asari-charcoal)] leading-relaxed">
          Mulai dari hand bouquet sederhana hingga rangkaian custom untuk pernikahan, kami percaya
          bahwa bunga adalah cara paling tulus untuk mengantarkan perasaan. Terima kasih telah
          memercayakan momen spesial Anda kepada Asari.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            to="/products"
            className="bg-[var(--asari-gold)] text-white text-xs uppercase tracking-[0.25em] px-8 py-3 hover:bg-[var(--asari-gold-light)] transition-colors"
          >
            Lihat Semua Produk
          </Link>
        </div>
      </section>
    </CustomerLayout>
  );
}