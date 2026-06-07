import { Product } from "@/lib/mockData";
import { formatRp } from "@/lib/format";
import { buildIgUrl, buildWaOrderUrl } from "@/lib/parseOrder";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col">
      <div className="relative overflow-hidden aspect-[3/4] bg-[var(--asari-blush)]/30">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!product.inStock && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "rgba(237,162,143,0.6)" }}
          >
            <span className="font-display italic text-white text-xl">Out of Stock.</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex-1">
        <h3 className="font-display text-lg text-[var(--asari-charcoal)]">{product.name}</h3>
        <p className="text-sm text-[var(--asari-gold)] mt-1 font-medium">
          {formatRp(product.price)}
        </p>
      </div>
      {product.inStock && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href={buildWaOrderUrl(product.name)}
            target="_blank"
            rel="noreferrer"
            className="text-center text-xs uppercase tracking-wider py-2 rounded-sm bg-[var(--asari-gold)] text-white hover:bg-[var(--asari-gold-light)] transition-colors"
          >
            Order 📱
          </a>
          <a
            href={buildIgUrl()}
            target="_blank"
            rel="noreferrer"
            className="text-center text-xs uppercase tracking-wider py-2 rounded-sm bg-[var(--asari-coral)] text-white hover:opacity-90 transition-opacity"
          >
            Order 📷
          </a>
        </div>
      )}
    </div>
  );
}
