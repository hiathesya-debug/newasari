import { writeFileSync } from "fs";
import { join } from "path";

const content = `import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/CustomerLayout";
import { PRODUCTS, CATEGORY_SLUGS } from "@/lib/mockData";
import { formatRp } from "@/lib/format";
import { buildIgUrl, buildWaOrderUrl } from "@/lib/parseOrder";
import iconWa from "@/assets/icon/ICON=WHATSAPP.svg";
import iconInsta from "@/assets/icon/ICON=INSTAGRAM.svg";

export const Route = createFileRoute("/product/$slug")({
  component: ProductDetailPage,
});

const DETAIL_LABELS = [
  { key: "mainFlowers", label: "Main Flowers" },
  { key: "companionFlowers", label: "Companion Flowers" },
  { key: "foliage", label: "Foliage" },
  { key: "wrappingPaper", label: "Wrapping Paper" },
  { key: "ribbonOrVase", label: "Ribbon / Finish" },
  { key: "arrangementStyle", label: "Arrangement Style" },
];

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) throw notFound();
  const categoryHref = \`/products/\${CATEGORY_SLUGS[product.category]}\`;

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-6 py-12" style={{ animation: "asariFadeIn 0.2s ease both" }}>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          <div className="md:sticky md:top-24 self-start">
            <div className="relative overflow-hidden aspect-[3/4] bg-[var(--asari-blush)]/30">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {!product.inStock && (
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

          <div className="flex flex-col gap-7">

            <p className="font-body text-xs uppercase tracking-[0.2em] text-[var(--asari-brown)]">
              {product.category}
            </p>

            <h1 className="font-display text-4xl md:text-5xl text-[var(--asari-charcoal)] leading-tight -mt-3">
              {product.name}
            </h1>

            <p className="font-body font-bold text-xl text-[var(--asari-gold)] -mt-3">
              {formatRp(product.price)}
            </p>

            {product.inStock ? (
              <div className="grid grid-cols-2 gap-3 -mt-1">
                <a
                  href={buildWaOrderUrl(product.name)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-body font-semibold inline-flex items-center justify-center gap-2 text-sm py-3 rounded-sm text-white transition-opacity hover:opacity-85"
                  style={{ backgroundColor: "#D9A84E" }}
                >
                  <img src={iconWa} alt="WhatsApp" className="h-4 w-4 brightness-0 invert" />
                  Order via WhatsApp
                </a>
                <a
                  href={buildIgUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="font-body font-semibold inline-flex items-center justify-center gap-2 text-sm py-3 rounded-sm text-white transition-opacity hover:opacity-85"
                  style={{ backgroundColor: "#B66878" }}
                >
                  <img src={iconInsta} alt="Instagram" className="h-4 w-4 brightness-0 invert" />
                  Order via Instagram
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

            <div>
              <h2 className="font-display text-2xl text-[var(--asari-charcoal)] mb-3">
                About this arrangement
              </h2>
              <p className="font-body text-sm leading-relaxed text-[var(--asari-charcoal)]/80">
                {product.description}
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-[var(--asari-charcoal)] mb-4">
                What is inside
              </h2>
              <ol className="flex flex-col gap-3">
                {DETAIL_LABELS.map(({ key, label }, idx) => {
                  const value = (product.details as Record<string, string | undefined>)[key];
                  if (!value) return null;
                  return (
                    <li key={key} className="flex gap-3 text-sm font-body">
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
                  );
                })}
              </ol>
            </div>

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
                      <span className="mt-0.5 text-[var(--asari-gold)]">✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

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

      <style>{\`
        @keyframes asariFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      \`}</style>
    </CustomerLayout>
  );
}
`;

const dest = join(process.cwd(), "src", "routes", "product.$slug.tsx");
writeFileSync(dest, content, "utf8");
console.log("✅ Written:", dest);
