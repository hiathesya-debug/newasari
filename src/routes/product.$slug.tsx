import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/CustomerLayout";
import { PRODUCTS, CATEGORY_SLUGS } from "@/lib/mockData";
import { formatRp } from "@/lib/format";
import { buildIgUrl } from "@/lib/parseOrder";
import iconWa    from "@/assets/icon/ICON=WHATSAPP.svg";
import iconInsta from "@/assets/icon/ICON=INSTAGRAM.svg";

export const Route = createFileRoute("/product/$slug")({
  component: ProductDetailPage,
});

const FLOWER_DETAIL_LABELS: { key: string; label: string }[] = [
  { key: "mainFlowers",      label: "Main Flowers"      },
  { key: "companionFlowers", label: "Companion Flowers"  },
  { key: "foliage",          label: "Foliage"            },
  { key: "wrappingPaper",    label: "Wrapping Paper"     },
  { key: "ribbonOrVase",     label: "Ribbon / Finish"    },
  { key: "arrangementStyle", label: "Arrangement Style"  },
];

const CUSTOM_WA_MSG = encodeURIComponent(
  "Halo Asari! Saya ingin membuat custom order. Boleh minta info lebih lanjut?"
);

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) throw notFound();

  const categorySlug = CATEGORY_SLUGS[product.category];
  const categoryHref = "/products?category=" + categorySlug;

  const displayPrice = product.priceDisplay ?? formatRp(product.price);
  const isCustom     = product.isLocked === true;

  // Decide which detail items to render
  const detailRows: { label: string; value: string }[] = product.detailItems
    ? product.detailItems
    : FLOWER_DETAIL_LABELS.flatMap(({ key, label }) => {
        const value = (product.details as Record<string, string | undefined>)[key];
        return value ? [{ label, value }] : [];
      });

  return (
    <CustomerLayout>
      <div
        className="max-w-7xl mx-auto px-6 py-12"
        style={{ animation: "asariFadeIn 0.2s ease both" }}
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-body uppercase tracking-widest text-[var(--asari-brown)] mb-10">
          <Link to="/products" className="hover:text-[var(--asari-gold)] transition-colors">
            Products
          </Link>
          <span className="opacity-40">›</span>
          <a href={categoryHref} className="hover:text-[var(--asari-gold)] transition-colors">
            {product.category}
          </a>
          <span className="opacity-40">›</span>
          <span className="text-[var(--asari-charcoal)]">{product.name}</span>
        </nav>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* LEFT — Image */}
          <div className="md:sticky md:top-24 self-start">
            <div className="relative overflow-hidden aspect-[3/4] bg-[var(--asari-blush)]/30">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* No overlay for custom/locked products */}
              {!product.inStock && !isCustom && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: "rgba(182,104,120,0.55)" }}
                >
                  <span className="font-display italic text-white text-3xl drop-shadow">
                    Out of Stock.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Details */}
          <div className="flex flex-col gap-7">

            <p className="font-body text-xs uppercase tracking-[0.2em] text-[var(--asari-brown)]">
              {product.category}
            </p>

            <h1 className="font-display text-4xl md:text-5xl text-[var(--asari-charcoal)] leading-tight -mt-3">
              {product.name}
            </h1>

            {/* Price — always gold */}
            <p
              className="font-body font-bold text-xl -mt-3"
              style={{ color: "#D9A84E" }}
            >
              {displayPrice}
            </p>

            {/* Order buttons */}
            {product.inStock ? (
              <div className="grid grid-cols-2 gap-3 -mt-1">
                <a
                  href={
                    isCustom
                      ? "https://wa.me/6287863912739?text=" + CUSTOM_WA_MSG
                      : "https://wa.me/6287863912739?text=Haiii%20kakk!%20Aku%20tertarik%20dengan%20" + encodeURIComponent(product.name)
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="font-body font-semibold inline-flex items-center justify-center gap-2 text-sm py-3 rounded-sm text-white transition-opacity hover:opacity-85"
                  style={{ backgroundColor: "#D9A84E" }}
                >
                  <img src={iconWa} alt="WhatsApp" className="h-4 w-4 brightness-0 invert" />
                  {isCustom ? "Pesan via WA" : "Order via WhatsApp"}
                </a>
                <a
                  href={buildIgUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="font-body font-semibold inline-flex items-center justify-center gap-2 text-sm py-3 rounded-sm text-white transition-opacity hover:opacity-85"
                  style={{ backgroundColor: "#B66878" }}
                >
                  <img src={iconInsta} alt="Instagram" className="h-4 w-4 brightness-0 invert" />
                  {isCustom ? "DM via Instagram" : "Order via Instagram"}
                </a>
              </div>
            ) : (
              <div
                className="font-body text-sm uppercase tracking-widest text-center py-3 rounded-sm -mt-1"
                style={{ backgroundColor: "rgba(182,104,120,0.12)", color: "#B66878" }}
              >
                Currently Out of Stock
              </div>
            )}

            <div className="h-px bg-[var(--asari-blush-light)]" />

            {/* Description */}
            <div>
              <h2 className="font-display text-2xl text-[var(--asari-charcoal)] mb-3">
                About this arrangement
              </h2>
              <p className="font-body text-sm leading-relaxed text-[var(--asari-charcoal)]/80">
                {product.description}
              </p>
            </div>

            {/* Details */}
            {detailRows.length > 0 && (
              <div>
                <h2 className="font-display text-2xl text-[var(--asari-charcoal)] mb-4">
                  {isCustom ? "How it works" : "What is inside"}
                </h2>
                <ol className="flex flex-col gap-3">
                  {detailRows.map(({ label, value }, idx) => (
                    <li key={label} className="flex gap-3 text-sm font-body">
                      <span
                        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                        style={{ backgroundColor: "#D9A84E" }}
                      >
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed text-[var(--asari-charcoal)]/80">
                        <strong className="text-[var(--asari-charcoal)]">{label}:</strong>{" "}
                        {value}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Perfect for */}
            {product.perfectFor && product.perfectFor.length > 0 && (
              <div>
                <h2 className="font-display text-2xl text-[var(--asari-charcoal)] mb-4">
                  Perfect for
                </h2>
                <ul className="flex flex-col gap-2">
                  {product.perfectFor.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm font-body text-[var(--asari-charcoal)]/80"
                    >
                      <span className="mt-0.5 text-[var(--asari-gold)]">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Back link */}
            <div className="pt-4 border-t border-[var(--asari-blush-light)]">
              <a
                href={categoryHref}
                className="font-body text-xs uppercase tracking-widest text-[var(--asari-brown)] hover:text-[var(--asari-gold)] transition-colors inline-flex items-center gap-2"
              >
                Back to {product.category}
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes asariFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </CustomerLayout>
  );
}
