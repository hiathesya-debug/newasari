export type ParsedOrder = {
  productName: string | null;
  quantity: number | null;
  request: string | null;
  cardMessage: string | null;
  paperBag: number | null;
  customerName: string | null;
  whatsapp: string | null;
  pickupDate: string | null;
  pickupTime: string | null;
  method: "Ambil di Store" | "Diantar" | null;
  address: string | null;
};

const FIELDS: { key: keyof ParsedOrder; labels: string[] }[] = [
  { key: "productName", labels: ["Nama Produk"] },
  { key: "quantity", labels: ["Jumlah Produk"] },
  { key: "request", labels: ["Request"] },
  { key: "cardMessage", labels: ["Isi Kartu Ucapan"] },
  { key: "paperBag", labels: ["Jumlah Paper Bag"] },
  { key: "customerName", labels: ["Nama Pemesan"] },
  { key: "whatsapp", labels: ["No WhatsApp", "No. WhatsApp"] },
  { key: "pickupDate", labels: ["Tanggal Pengambilan"] },
  { key: "pickupTime", labels: ["Jam Pengambilan"] },
  { key: "method", labels: ["Metode Penyerahan"] },
  { key: "address", labels: ["Alamat Pengiriman"] },
];

function extract(text: string, labels: string[]): string | null {
  for (const label of labels) {
    // Match line containing label followed by colon, capture rest of line
    const re = new RegExp(
      `\\*?\\s*${label.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}[^:]*:\\s*(.*)`,
      "i",
    );
    const m = text.match(re);
    if (m && m[1] !== undefined) {
      const val = m[1].trim();
      if (val) return val;
    }
  }
  return null;
}

export function parseOrderMessage(text: string): ParsedOrder {
  const result: ParsedOrder = {
    productName: null, quantity: null, request: null, cardMessage: null,
    paperBag: null, customerName: null, whatsapp: null, pickupDate: null,
    pickupTime: null, method: null, address: null,
  };
  for (const f of FIELDS) {
    const raw = extract(text, f.labels);
    if (raw === null) continue;
    if (f.key === "quantity" || f.key === "paperBag") {
      const n = parseInt(raw.replace(/\D/g, ""), 10);
      (result[f.key] as number | null) = isNaN(n) ? null : n;
    } else if (f.key === "method") {
      const v = raw.toLowerCase();
      if (v.includes("diantar")) result.method = "Diantar";
      else if (v.includes("ambil") || v.includes("store")) result.method = "Ambil di Store";
    } else if (f.key === "cardMessage") {
      result.cardMessage = raw === "-" ? "" : raw;
    } else if (f.key === "pickupTime") {
      // "12.30 WIB" → "12:30"
      const tm = raw.match(/(\d{1,2})[.:](\d{2})/);
      result.pickupTime = tm ? `${tm[1].padStart(2, "0")}:${tm[2]}` : raw;
    } else {
      (result[f.key] as string | null) = raw;
    }
  }
  return result;
}

export const ORDER_TEMPLATE = `🌼 FORMAT PEMESANAN ASARI FLORIST 🌼
Haiii Kaaak! Silakan isi format di bawah ini yaaa 🤗
(Catatan: Mohon tidak mengubah teks yang dicetak tebal agar pesanan cepat diproses sistem)

📋 DETAIL PESANAN
* Nama Produk: {PRODUCT}
* Jumlah Produk: 
* Request: 
* Isi Kartu Ucapan (isi "-" jika kosongan): 
* Jumlah Paper Bag (+2000) (isi "0" jika tidak pakai): 

👤 INFORMASI PEMESAN
* Nama Pemesan: 
* No WhatsApp: 

🚚 JADWAL & PENGIRIMAN
* Tanggal Pengambilan (Contoh: Sabtu, 30 Mei 2026): 
* Jam Pengambilan (Contoh: 12.30 WIB): 
* Metode Penyerahan (Ketik: Ambil di Store / Diantar): 
* Alamat Pengiriman (Kosongkan jika diambil di store): `;

export const WA_NUMBER = "6287863912739";
export const IG_HANDLE = "asari.bouquetflowerbdg";

export function buildWaOrderUrl(productName: string): string {
  const msg = ORDER_TEMPLATE.replace("{PRODUCT}", productName);
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function buildIgUrl(): string {
  return `https://www.instagram.com/${IG_HANDLE}/`;
}
