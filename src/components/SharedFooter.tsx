import iconInsta from "@/assets/icon/ICON=INSTAGRAM.svg";
import iconTiktok from "@/assets/icon/ICON=TIKTOK.svg";
import iconWa from "@/assets/icon/ICON=WHATSAPP.svg";
import logoImg from "@/assets/icon/logo.png";

export function SharedFooter() {
  return (
    <footer
      className="text-white mt-16"
      style={{ background: "linear-gradient(to right, #D9A84E, #EDA28F)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">
        {/* Kolom 1 — Logo & Deskripsi */}
        <div>
          <img
            src={logoImg}
            alt="Asari Bouquet & Flower"
            className="h-16 w-auto object-contain brightness-0 invert mb-4"
          />
          <p className="mt-2 text-sm leading-relaxed text-white/90 max-w-xs">
            Florist rumahan di Antapani, Bandung. Setiap rangkaian kami kerjakan
            dengan tangan, dari hati, untuk momen istimewamu.
          </p>
        </div>

        {/* Kolom 2 — Category */}
        <div>
          <h4 className="font-display text-xl mb-4 text-white">Category</h4>
          <ul className="space-y-2 text-sm text-white/90">
            <li>Freshest Series</li>
            <li>Fresh Bouquet</li>
            <li>Hand Bouquet</li>
            <li>Flower Vase</li>
            <li>Custom Order</li>
          </ul>
        </div>

        {/* Kolom 3 — Contact */}
        <div>
          <h4 className="font-display text-xl mb-4 text-white">Contact Us</h4>
          <ul className="space-y-3 text-sm text-white/90">
            <li className="flex items-center gap-2">
              <img src={iconInsta} alt="Instagram" className="h-5 w-5 object-contain brightness-0 invert" />
              @asari.bouquetflowerbdg
            </li>
            <li className="flex items-center gap-2">
              <img src={iconTiktok} alt="TikTok" className="h-5 w-5 object-contain brightness-0 invert" />
              @asari.bouquetflowerbdg
            </li>
            <li className="flex items-center gap-2">
              <img src={iconWa} alt="WhatsApp" className="h-5 w-5 object-contain brightness-0 invert" />
              +62 878-6391-2739
            </li>
            <li className="pl-7">Antapani, Bandung</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-white/80 text-center">
          © {new Date().getFullYear()} Asari Bouquet &amp; Flower. All rights reserved.
        </div>
      </div>
    </footer>
  );
}