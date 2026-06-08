import { Product } from "@/lib/mockData";
import { formatRp } from "@/lib/format";
import { buildIgUrl, buildWaOrderUrl } from "@/lib/parseOrder";
import iconWa from "@/assets/icon/ICON=WHATSAPP.svg";
import iconInsta from "@/assets/icon/ICON=INSTAGRAM.svg";

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
            style={{ backgroundColor: "rgba(182,104,120,0.6)" }}
          >
            <span className="font-display italic text-white text-xl">Out of Stock.</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex-1">
        <h3 className="font-display text-2xl text-[var(--asari-charcoal)]">{product.name}</h3>
        <p className="font-body font-bold text-sm text-[var(--asari-gold)] mt-1">
          {formatRp(product.price)}
        </p>
      </div>
      {product.inStock && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {/* Order via WhatsApp */}
          <a
            href={buildWaOrderUrl(product.name)}
            target="_blank"
            rel="noreferrer"
            className="font-body font-semibold inline-flex items-center justify-center gap-2 text-sm py-2 rounded-sm text-white transition-opacity hover:opacity-85"
            style={{ backgroundColor: "#D9A84E" }}
          >
            <img src={iconWa} alt="WhatsApp" className="h-4 w-4 brightness-0 invert" />
            Order
          </a>
          {/* Order via Instagram */}
          <a
            href={buildIgUrl()}
            target="_blank"
            rel="noreferrer"
            className="font-body font-semibold inline-flex items-center justify-center gap-2 text-sm py-2 rounded-sm text-white transition-opacity hover:opacity-85"
            style={{ backgroundColor: "#B66878" }}
          >
            <img src={iconInsta} alt="Instagram" className="h-4 w-4 brightness-0 invert" />
            Order
          </a>
        </div>
      )}
    </div>
  );
}