import { createFileRoute, Link } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/CustomerLayout";
import { ProductCard } from "@/components/ProductCard";
import { SectionTitle, Divider } from "@/components/SectionBits";
import { CATEGORIES, CATEGORY_SLUGS, PRODUCTS } from "@/lib/mockData";
import heroImg from "@/assets/hero-floral.jpg";
import customProductImage from "@/assets/products/custom product.png";

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
              {/* Use query param URL — path-based routes are not nested correctly */}
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
              Bespoke & Personalised
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-white leading-tight">
              Custom Order
            </h2>
            <p className="font-body text-white/80 text-sm max-w-md mt-2 leading-relaxed">
              Bring your idea to life — we&apos;ll wrap it.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <a
                href={WA_CUSTOM}
                target="_blank"
                rel="noreferrer"
                className="font-body font-semibold text-xs uppercase tracking-widest px-6 py-3 text-white transition-colors"
                style={{ backgroundColor: "#D9A84E" }}
              >
                Ask the Owner
              </a>
              <a
                href="/products?category=custom-order"
                className="font-body font-semibold text-xs uppercase tracking-widest px-6 py-3 text-white border border-white/60 hover:bg-white/10 transition-colors"
              >
                See Custom Products
              </a>
            </div>
          </div>
        </div>
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
