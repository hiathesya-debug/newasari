import freshImg from "@/assets/product-fresh.jpg";
import bouquetImg from "@/assets/product-bouquet.jpg";
import handImg from "@/assets/product-hand.jpg";
import vaseImg from "@/assets/product-vase.jpg";

export type Category =
  | "Freshest Series"
  | "Flower Bouquet"
  | "Hand Bouquet"
  | "Flower Vase"
  | "Custom Order";

export const CATEGORIES: Category[] = [
  "Freshest Series",
  "Flower Bouquet",
  "Hand Bouquet",
  "Flower Vase",
];

export const CATEGORY_SLUGS: Record<Category, string> = {
  "Freshest Series": "freshest-series",
  "Flower Bouquet": "flower-bouquet",
  "Hand Bouquet": "hand-bouquet",
  "Flower Vase": "flower-vase",
  "Custom Order": "custom-order",
};

export const SLUG_TO_CATEGORY: Record<string, Category> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([k, v]) => [v, k as Category]),
) as Record<string, Category>;

export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  inStock: boolean;
  image: string;
  description?: string;
  sold?: number;
  status?: "Active" | "Draft";
};

const img = (c: Category) => {
  switch (c) {
    case "Freshest Series": return freshImg;
    case "Flower Bouquet": return bouquetImg;
    case "Hand Bouquet": return handImg;
    case "Flower Vase": return vaseImg;
    default: return freshImg;
  }
};

export const PRODUCTS: Product[] = [
  // Freshest Series
  { id: "p1", name: "Bunga Mawar Merah", category: "Freshest Series", price: 350000, stock: 8, inStock: true, image: img("Freshest Series"), sold: 24, status: "Active" },
  { id: "p2", name: "Bouquet Peach Cantik", category: "Freshest Series", price: 275000, stock: 12, inStock: true, image: img("Freshest Series"), sold: 31, status: "Active" },
  { id: "p3", name: "Rangkaian Mawar Putih", category: "Freshest Series", price: 420000, stock: 0, inStock: false, image: img("Freshest Series"), sold: 18, status: "Active" },
  { id: "p4", name: "Bunga Tulip Pink", category: "Freshest Series", price: 195000, stock: 15, inStock: true, image: img("Freshest Series"), sold: 12, status: "Active" },
  // Flower Bouquet
  { id: "p5", name: "Pastel Dream Box", category: "Flower Bouquet", price: 275000, stock: 6, inStock: true, image: img("Flower Bouquet"), sold: 22, status: "Active" },
  { id: "p6", name: "Sunset Gradient Bouquet", category: "Flower Bouquet", price: 295000, stock: 9, inStock: true, image: img("Flower Bouquet"), sold: 17, status: "Active" },
  { id: "p7", name: "Classic Red Rose Dozen", category: "Flower Bouquet", price: 280000, stock: 0, inStock: false, image: img("Flower Bouquet"), sold: 28, status: "Active" },
  { id: "p8", name: "Wildflower Field", category: "Flower Bouquet", price: 150000, stock: 20, inStock: true, image: img("Flower Bouquet"), sold: 9, status: "Active" },
  // Hand Bouquet
  { id: "p9", name: "Peach Bliss Hand Bouquet", category: "Hand Bouquet", price: 220000, stock: 11, inStock: true, image: img("Hand Bouquet"), sold: 19, status: "Active" },
  { id: "p10", name: "Bridal White Bouquet", category: "Hand Bouquet", price: 850000, stock: 4, inStock: true, image: img("Hand Bouquet"), sold: 6, status: "Active" },
  { id: "p11", name: "Autumn Warm Tones", category: "Hand Bouquet", price: 310000, stock: 0, inStock: false, image: img("Hand Bouquet"), sold: 14, status: "Active" },
  { id: "p12", name: "Mini Daily Wrap", category: "Hand Bouquet", price: 65000, stock: 30, inStock: true, image: img("Hand Bouquet"), sold: 42, status: "Active" },
  // Flower Vase
  { id: "p13", name: "Royal Purple Orchid", category: "Flower Vase", price: 380000, stock: 5, inStock: true, image: img("Flower Vase"), sold: 11, status: "Active" },
  { id: "p14", name: "Sunflower Vase Arrangement", category: "Flower Vase", price: 240000, stock: 7, inStock: true, image: img("Flower Vase"), sold: 16, status: "Active" },
  { id: "p15", name: "Pink Lily Vase", category: "Flower Vase", price: 320000, stock: 0, inStock: false, image: img("Flower Vase"), sold: 13, status: "Active" },
  { id: "p16", name: "Golden Sunrise Vase", category: "Flower Vase", price: 185000, stock: 14, inStock: true, image: img("Flower Vase"), sold: 8, status: "Active" },
];

export type Review = {
  id: string;
  name: string;
  date: Date;
  text: string;
};

const REVIEW_TEXTS = [
  "Bunganya cantik banget, fresh dan rapi. Pengirimannya juga tepat waktu. Pasti order lagi!",
  "Pelayanannya ramah dan hasil bouquet-nya melebihi ekspektasi. Pacar saya sangat suka.",
  "Asari selalu jadi pilihan utama untuk bunga di Bandung. Selalu cantik dan tahan lama.",
  "Custom order untuk wedding kemarin hasilnya stunning. Highly recommended!",
  "Packaging-nya cantik, bunganya segar, dan pengirimannya cepat. Thank you Asari!",
  "Pesanan untuk kado ulang tahun mama. Beliau senang sekali. Terima kasih banyak.",
  "Hand bouquet-nya elegant banget. Cocok untuk acara graduation.",
  "Pastel dream box favorit aku. Warnanya soft dan bunganya berkualitas premium.",
];

const NAMES = [
  "Carla Mentari", "Rina Aulia", "Bagas Pratama", "Anonymous",
  "Sinta Dewi", "Anonymous", "Putri Maharani", "Dimas Saputra",
];

export const REVIEWS: Record<string, Review[]> = {};
const MONTH_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
MONTH_NUMS.forEach((m) => {
  const key = `2026-${String(m).padStart(2, "0")}`;
  REVIEWS[key] = Array.from({ length: 8 }, (_, i) => ({
    id: `${key}-${i}`,
    name: NAMES[i % NAMES.length],
    date: new Date(2026, m - 1, 5 + i * 2, 10, 0),
    text: REVIEW_TEXTS[i % REVIEW_TEXTS.length],
  }));
});

export type OrderStatus = "Pending" | "Dikonfirmasi" | "Diproses" | "Siap" | "Selesai" | "Dibatalkan";

export type Order = {
  id: string;
  customerName: string;
  whatsapp: string;
  productName: string;
  quantity: number;
  paperBag: number;
  request?: string;
  cardMessage?: string;
  pickupDate: string;
  pickupTime: string;
  method: "Ambil di Store" | "Diantar";
  address?: string;
  total: number;
  source: "WA" | "IG";
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
};

export const ORDERS: Order[] = [
  { id: "ORD-001", customerName: "Sinta Dewi", whatsapp: "+6281234567890", productName: "Pastel Dream Box", quantity: 1, paperBag: 1, pickupDate: "Sabtu, 30 Mei 2026", pickupTime: "12:30", method: "Diantar", address: "Jl. Antapani No. 42, Bandung", total: 277000, source: "WA", status: "Pending", createdAt: new Date(2026, 4, 28) },
  { id: "ORD-002", customerName: "Rina Aulia", whatsapp: "+6285678901234", productName: "Bunga Mawar Merah", quantity: 2, paperBag: 2, pickupDate: "Minggu, 31 Mei 2026", pickupTime: "10:00", method: "Ambil di Store", total: 704000, source: "IG", status: "Dikonfirmasi", createdAt: new Date(2026, 4, 27) },
  { id: "ORD-003", customerName: "Bagas Pratama", whatsapp: "+6289012345678", productName: "Bridal White Bouquet", quantity: 1, paperBag: 0, pickupDate: "Senin, 1 Juni 2026", pickupTime: "14:00", method: "Diantar", address: "Hotel Padma, Bandung", total: 850000, source: "WA", status: "Diproses", createdAt: new Date(2026, 4, 26) },
  { id: "ORD-004", customerName: "Putri Maharani", whatsapp: "+6287812345678", productName: "Mini Daily Wrap", quantity: 3, paperBag: 0, pickupDate: "Sabtu, 30 Mei 2026", pickupTime: "16:00", method: "Ambil di Store", total: 195000, source: "WA", status: "Siap", createdAt: new Date(2026, 4, 29) },
  { id: "ORD-005", customerName: "Dimas Saputra", whatsapp: "+6281298765432", productName: "Sunflower Vase Arrangement", quantity: 1, paperBag: 1, pickupDate: "Jumat, 29 Mei 2026", pickupTime: "11:00", method: "Diantar", address: "Jl. Riau No. 10, Bandung", total: 242000, source: "IG", status: "Selesai", createdAt: new Date(2026, 4, 25) },
  { id: "ORD-006", customerName: "Carla Mentari", whatsapp: "+6282345678901", productName: "Peach Bliss Hand Bouquet", quantity: 1, paperBag: 1, pickupDate: "Minggu, 31 Mei 2026", pickupTime: "13:30", method: "Ambil di Store", total: 222000, source: "WA", status: "Pending", createdAt: new Date(2026, 4, 29) },
  { id: "ORD-007", customerName: "Andini Permata", whatsapp: "+6285511223344", productName: "Wildflower Field", quantity: 2, paperBag: 2, pickupDate: "Senin, 1 Juni 2026", pickupTime: "09:00", method: "Diantar", address: "Jl. Cihampelas No. 25", total: 304000, source: "WA", status: "Dikonfirmasi", createdAt: new Date(2026, 4, 28) },
  { id: "ORD-008", customerName: "Reza Mahendra", whatsapp: "+6281122334455", productName: "Bouquet Peach Cantik", quantity: 1, paperBag: 0, pickupDate: "Sabtu, 30 Mei 2026", pickupTime: "15:00", method: "Ambil di Store", total: 275000, source: "IG", status: "Diproses", createdAt: new Date(2026, 4, 28) },
  { id: "ORD-009", customerName: "Tania Sari", whatsapp: "+6287799887766", productName: "Royal Purple Orchid", quantity: 1, paperBag: 1, pickupDate: "Minggu, 31 Mei 2026", pickupTime: "17:00", method: "Diantar", address: "Setrasari Mall area", total: 382000, source: "WA", status: "Selesai", createdAt: new Date(2026, 4, 24) },
  { id: "ORD-010", customerName: "Hadi Wijaya", whatsapp: "+6281999888777", productName: "Bunga Tulip Pink", quantity: 1, paperBag: 0, pickupDate: "Sabtu, 30 Mei 2026", pickupTime: "11:30", method: "Ambil di Store", total: 195000, source: "WA", status: "Dibatalkan", createdAt: new Date(2026, 4, 27) },
];

export function generateSalesData(year: number, month: number) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const seed = year * 100 + month;
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const x = Math.sin(seed + day) * 10000;
    const noise = x - Math.floor(x);
    const base = 120000 + noise * 180000;
    return { day, revenue: Math.round(base) };
  });
}
