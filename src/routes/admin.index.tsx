import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { TrendingDown, TrendingUp, Pencil, Check, X, Loader2, CalendarClock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { REVIEWS } from "@/lib/mockData";
import { formatMonthYear, timeAgo } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, isOwner } from "@/lib/auth";
import iconInsta from "@/assets/icon/ICON=INSTAGRAM.svg";
import iconTiktok from "@/assets/icon/ICON=TIKTOK.svg";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — Asari Admin" }] }),
  component: Dashboard,
});

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// Status yang dihitung sebagai revenue
const REVENUE_STATUSES = ["Dikonfirmasi", "Diproses", "Siap", "Selesai"];

/* ─── Load sales data from real orders ── */
async function loadSalesData(year: number, month: number) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const start = `${year}-${String(month).padStart(2, "0")}-01T00:00:00`;
  const end = `${year}-${String(month).padStart(2, "0")}-${daysInMonth}T23:59:59`;

  const { data } = await (supabase as any)
    .from("orders")
    .select("created_at, total, status")
    .gte("created_at", start)
    .lte("created_at", end)
    .in("status", REVENUE_STATUSES);

  const orders = data ?? [];

  // Aggregate per day
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dayRevenue = orders
      .filter((o: any) => new Date(o.created_at).getDate() === day)
      .reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
    return { day, revenue: dayRevenue };
  });
}

/* ─── Load total orders count ── */
async function loadTotalOrders(year: number, month: number): Promise<number> {
  const daysInMonth = new Date(year, month, 0).getDate();
  const start = `${year}-${String(month).padStart(2, "0")}-01T00:00:00`;
  const end = `${year}-${String(month).padStart(2, "0")}-${daysInMonth}T23:59:59`;

  const { count } = await (supabase as any)
    .from("orders")
    .select("id", { count: "exact", head: true })
    .gte("created_at", start)
    .lte("created_at", end)
    .in("status", REVENUE_STATUSES);

  return count ?? 0;
}

/* ─── Settings helpers ── */
async function getSetting(key: string): Promise<{ value: string; updated_at: string } | null> {
  const { data } = await (supabase as any)
    .from("site_settings").select("value,updated_at").eq("key", key).maybeSingle();
  return data ?? null;
}
async function setSetting(key: string, value: string) {
  await (supabase as any).from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
}
function fmtDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

/* ─── Followers Card ── */
function FollowersCard({ label, iconSrc, brandBg, settingKey, canEdit }: {
  label: string; iconSrc: string; brandBg: string; settingKey: string; canEdit: boolean;
}) {
  const [value, setValue] = useState<number | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);
  const [changeUp, setChangeUp] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [countInput, setCountInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSetting(settingKey).then((d) => { if (d) { setValue(Number(d.value)); setUpdatedAt(d.updated_at); } });
    getSetting(`${settingKey}_prev`).then((d) => { if (d) setPrevValue(Number(d.value)); });
    getSetting(`${settingKey}_change`).then((d) => {
      if (d) { setChangeUp(!d.value.startsWith("-")); setChange(Math.abs(Number(d.value))); }
    });
  }, [settingKey]);

  const newVal = parseInt(countInput.replace(/\D/g, ""), 10);
  const autoPct = (!isNaN(newVal) && prevValue !== null && prevValue > 0)
    ? Math.round(((newVal - prevValue) / prevValue) * 100) : null;
  const autoUp = autoPct !== null ? autoPct >= 0 : true;

  const handleSave = async () => {
    if (isNaN(newVal)) return;
    setSaving(true);
    if (value !== null) await setSetting(`${settingKey}_prev`, String(value));
    await setSetting(settingKey, String(newVal));
    if (autoPct !== null) {
      await setSetting(`${settingKey}_change`, `${autoPct >= 0 ? "+" : ""}${autoPct}`);
      setChange(Math.abs(autoPct)); setChangeUp(autoPct >= 0);
    }
    setPrevValue(value); setValue(newVal);
    setUpdatedAt(new Date().toISOString()); setEditing(false); setSaving(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[var(--asari-blush-light)] p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: brandBg }}>
            <img src={iconSrc} alt={label} className="h-5 w-5 object-contain brightness-0 invert" />
          </div>
          <p className="font-display text-lg text-[var(--asari-charcoal)]/80">{label}</p>
        </div>
        {canEdit && !editing && (
          <button onClick={() => { setCountInput(String(value ?? "")); setEditing(true); }}
            className="p-1 text-[var(--asari-charcoal)]/40 hover:text-[var(--asari-gold)]" title="Update">
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[var(--asari-charcoal)]/50 mb-1">Jumlah followers</label>
            <input type="number" value={countInput} onChange={(e) => setCountInput(e.target.value)}
              className="w-full border border-[var(--asari-gold)] rounded-lg px-3 py-2 text-xl font-body font-bold focus:outline-none"
              placeholder="0" autoFocus onKeyDown={(e) => e.key === "Enter" && handleSave()} />
          </div>
          {autoPct !== null && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${
              autoUp ? "border-green-300 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-600"
            }`}>
              {autoUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {autoUp ? "+" : ""}{autoPct}% dari bulan lalu
              <span className="text-xs opacity-60 ml-1">({prevValue?.toLocaleString("id-ID")} → {newVal.toLocaleString("id-ID")})</span>
            </div>
          )}
          {autoPct === null && prevValue === null && (
            <p className="text-xs text-[var(--asari-charcoal)]/40">Persentase akan dihitung otomatis bulan depan.</p>
          )}
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--asari-gold)] text-white py-2 rounded-lg text-xs font-semibold disabled:opacity-60">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Simpan
            </button>
            <button onClick={() => setEditing(false)}
              className="flex-1 flex items-center justify-center gap-1.5 border border-[var(--asari-blush-light)] py-2 rounded-lg text-xs text-[var(--asari-charcoal)]">
              <X className="h-3.5 w-3.5" /> Batal
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-end justify-between">
          <p className="font-body font-bold text-4xl">
            {value !== null ? value.toLocaleString("id-ID") : <span className="text-[var(--asari-charcoal)]/30 text-3xl">Belum diisi</span>}
          </p>
          {change !== null && (
            <span className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${
              changeUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {changeUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {change}%
            </span>
          )}
        </div>
      )}
      {!editing && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--asari-charcoal)]/50">
          <CalendarClock className="h-3 w-3 shrink-0" />
          <span>Update setiap tanggal 1{updatedAt ? ` · Terakhir: ${fmtDate(updatedAt)}` : ""}</span>
        </div>
      )}
    </div>
  );
}

/* ─── KPI Card ── */
function KpiCard({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[var(--asari-blush-light)] p-6">
      <p className="font-display text-sm text-[var(--asari-charcoal)]/70">{label}</p>
      <p className="font-body font-bold text-4xl mt-2">
        {typeof value === "number" ? value.toLocaleString("id-ID") : value}
      </p>
      {note && <p className="text-[11px] text-[var(--asari-charcoal)]/40 mt-2">{note}</p>}
    </div>
  );
}

/* ─── Dashboard ── */
function Dashboard() {
  const today = new Date();
  const user = useAuth();
  const owner = isOwner(user);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [reviewMonth, setReviewMonth] = useState(today.getMonth() + 1);
  const [showPicker, setShowPicker] = useState(false);

  const [salesData, setSalesData] = useState<{ day: number; revenue: number }[]>([]);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [loadingSales, setLoadingSales] = useState(true);

  const periodLabel = formatMonthYear(new Date(year, month - 1));
  const reviews = REVIEWS[`${year}-${String(reviewMonth).padStart(2, "0")}`] ?? [];

  useEffect(() => {
    setLoadingSales(true);
    Promise.all([
      loadSalesData(year, month),
      loadTotalOrders(year, month),
    ]).then(([sales, orders]) => {
      setSalesData(sales);
      setTotalOrders(orders);
      setLoadingSales(false);
    });
  }, [year, month]);

  const totalRevenue = salesData.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl md:text-5xl">Dashboard</h1>
        <div className="relative">
          <button onClick={() => setShowPicker((v) => !v)} className="text-sm flex items-center gap-2">
            <span className="text-[var(--asari-charcoal)]">Period:</span>
            <span className="text-[var(--asari-coral)] font-medium">{periodLabel}</span>
          </button>
          {showPicker && (
            <div className="absolute right-0 mt-2 bg-white border border-[var(--asari-blush-light)] rounded shadow p-3 z-10 w-48">
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full mb-2 border rounded px-2 py-1 text-sm">
                {MONTH_NAMES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
              <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full border rounded px-2 py-1 text-sm">
                {[2024,2025,2026,today.getFullYear()].filter((v,i,a)=>a.indexOf(v)===i).map((y)=>(
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <button onClick={() => setShowPicker(false)} className="w-full mt-2 bg-[var(--asari-gold)] text-white text-xs uppercase py-1.5 rounded">Done</button>
            </div>
          )}
        </div>
      </div>
      <div className="h-px bg-[var(--asari-gold)]" />

      <div className="grid lg:grid-cols-[3fr_1fr] gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-[var(--asari-blush-light)] px-6 pt-6 pb-3">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="font-display text-2xl">Sales Statistics</h2>
              <p className="text-[var(--asari-coral)] text-sm">{periodLabel}</p>
            </div>
            {!loadingSales && (
              <div className="text-right">
                <p className="text-xs text-[var(--asari-charcoal)]/50">Total Revenue</p>
                <p className="font-body font-bold text-sm text-[var(--asari-gold)]">
                  Rp {totalRevenue.toLocaleString("id-ID")}
                </p>
              </div>
            )}
          </div>
          <div className="h-64 mt-3">
            {loadingSales ? (
              <div className="h-full flex items-center justify-center text-[var(--asari-charcoal)]/40 gap-2">
                <Loader2 className="h-5 w-5 animate-spin" /> Memuat data...
              </div>
            ) : (
              <ResponsiveContainer>
                <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D9A84E" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#F2DAAC" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#8C775E" }} axisLine={{ stroke: "#E8DCC8" }} tickLine={false} />
                  <YAxis tickFormatter={(v) => v === 0 ? "0" : `${Math.round(v/1000)}k`}
                    tick={{ fontSize: 10, fill: "#8C775E" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(v: number) => v === 0 ? ["Rp 0", "Revenue"] : [`Rp ${v.toLocaleString("id-ID")}`, "Revenue"]}
                    contentStyle={{ borderRadius: 6, border: "1px solid #F2D1B3", fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#D9A84E" strokeWidth={2} fill="url(#goldFill)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="text-[10px] text-[var(--asari-charcoal)]/40 mt-1 text-right">
            Revenue = order dengan status Dikonfirmasi ke atas
          </p>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 content-start">
          <FollowersCard label="Instagram Followers" iconSrc={iconInsta} brandBg="#E1306C" settingKey="instagram_followers" canEdit={!!owner} />
          <FollowersCard label="TikTok Followers" iconSrc={iconTiktok} brandBg="#010101" settingKey="tiktok_followers" canEdit={!!owner} />
          <KpiCard
            label="Total Orders"
            value={totalOrders !== null ? totalOrders : "—"}
            note={totalOrders !== null ? `${periodLabel} · dikonfirmasi ke atas` : undefined}
          />
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--asari-blush-light)] p-6">
        <h2 className="font-display text-2xl mb-4"><span className="italic">All</span> Review</h2>
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
          {MONTH_NAMES.slice(1).map((name, idx) => {
            const num = idx + 2;
            const active = num === reviewMonth;
            return (
              <button key={name} onClick={() => setReviewMonth(num)}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
                  active ? "bg-[var(--asari-charcoal)] text-white" : "border border-[var(--asari-charcoal)]/30 text-[var(--asari-charcoal)] hover:border-[var(--asari-gold)]"
                }`}>{name}</button>
            );
          })}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.length === 0 && <p className="text-sm text-[var(--asari-charcoal)]/60">Belum ada review untuk bulan ini.</p>}
          {reviews.map((r) => <ReviewCard key={r.id} name={r.name} when={timeAgo(r.date)} text={r.text} />)}
        </div>
      </div>
    </div>
  );
}

const AVATAR_COLORS = ["#F2D0A7","#F2CDC4","#F2DAAC","#EDA28F","#F2CA7E"];
function ReviewCard({ name, when, text }: { name: string; when: string; text: string }) {
  const initial = name.charAt(0).toUpperCase();
  const color = AVATAR_COLORS[name.length % AVATAR_COLORS.length];
  return (
    <div className="border border-[var(--asari-blush-light)] rounded-lg p-4 bg-white">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium text-white" style={{ backgroundColor: color }}>{initial}</div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{name}</p>
          <p className="text-[11px] text-[var(--asari-charcoal)]/60">{when}</p>
        </div>
      </div>
      <p className="text-[13px] text-[var(--asari-charcoal)] line-clamp-3">{text}</p>
    </div>
  );
}