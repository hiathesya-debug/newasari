import { Link } from "@tanstack/react-router";
import { Product } from "@/lib/mockData";
import { formatRp } from "@/lib/format";
import { buildIgUrl, buildWaOrderUrl } from "@/lib/parseOrder";
import iconWa    from "@/assets/icon/ICON=WHATSAPP.svg";
import iconInsta from "@/assets/icon/ICON=INSTAGRAM.svg";

export function ProductCard({ product }: { product: Product }) {
  const displayPrice = product.priceDisplay ?? formatRp(product.price);

  return (
    <div className="group flex flex-col">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="flex flex-col flex-1 cursor-pointer"
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-[var(--asari-blush)]/30">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* No Out of Stock overlay for locked/custom products */}
          {!product.inStock && !product.isLocked && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: "rgba(182,104,120,0.6)" }}
            >
              <span className="font-display italic text-white text-xl">Out of Stock.</span>
            </div>
          )}
        </div>

        {/* Name + Price */}
        <div className="mt-4 flex-1">
          <h3 className="font-display text-2xl text-[var(--asari-charcoal)] group-hover:text-[var(--asari-gold)] transition-colors duration-200">
            {product.name}
          </h3>
          <p
            className="font-body font-bold text-sm mt-1"
            style={{ color: "#D9A84E" }}
          >
            {displayPrice}
          </p>
        </div>
      </Link>

      {/* Order buttons — outside the Link to avoid nested <a> */}
      {product.inStock && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href={
              product.isLocked
                ? "https://wa.me/6287863912739?text=Halo%20Asari!%20Saya%20ingin%20membuat%20custom%20order.%20Boleh%20minta%20info%20lebih%20lanjut%3F"
                : buildWaOrderUrl(product.name)
            }
            target="_blank"
            rel="noreferrer"
            className="font-body font-semibold inline-flex items-center justify-center gap-2 text-sm py-2 rounded-sm text-white transition-opacity hover:opacity-85"
            style={{ backgroundColor: "#D9A84E" }}
          >
            <img src={iconWa} alt="WhatsApp" className="h-4 w-4 brightness-0 invert" />
            Order
          </a>
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
