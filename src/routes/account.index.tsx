import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { TrendingDown, TrendingUp, Pencil, Check, X, Loader2, CalendarClock, Lock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { generateSalesData, REVIEWS } from "@/lib/mockData";
import { formatMonthYear, timeAgo } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, isOwner } from "@/lib/auth";
import iconInsta from "@/assets/icon/ICON=INSTAGRAM.svg";
import iconTiktok from "@/assets/icon/ICON=TIKTOK.svg";

export const Route = createFileRoute("/account/")({
  head: () => ({ meta: [{ title: "Dashboard — Asari Admin" }] }),
  component: Dashboard,
});

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

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
function FollowersCard({ label, icon, settingKey, canEdit }: {
  label: string; icon: string; settingKey: string; canEdit: boolean;
}) {
  const today = new Date();
  const isFirstOfMonth = today.getDate() === 1;
  const canEditNow = canEdit && isFirstOfMonth;

  const [value, setValue] = useState<number | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSetting(settingKey).then((d) => {
      if (d) { setValue(Number(d.value)); setUpdatedAt(d.updated_at); }
    });
    getSetting(`${settingKey}_prev`).then((d) => {
      if (d) setPrevValue(Number(d.value));
    });
  }, [settingKey]);

  const handleSave = async () => {
    const val = parseInt(input.replace(/\D/g, ""), 10);
    if (isNaN(val)) return;
    setSaving(true);
    // Save current as prev before updating
    if (value !== null) await setSetting(`${settingKey}_prev`, String(value));
    await setSetting(settingKey, String(val));
    setPrevValue(value);
    setValue(val);
    setUpdatedAt(new Date().toISOString());
    setEditing(false);
    setSaving(false);
  };

  // Calculate % change
  const pct = (value !== null && prevValue !== null && prevValue > 0)
    ? Math.round(((value - prevValue) / prevValue) * 100)
    : null;
  const up = pct !== null ? pct >= 0 : true;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[var(--asari-blush-light)] p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img src={icon} alt={label} className="h-4 w-4 object-contain opacity-60" />
          <p className="text-sm text-[var(--asari-charcoal)]/70">{label}</p>
        </div>
        {canEdit && !editing && (
          isFirstOfMonth ? (
            <button onClick={() => { setInput(String(value ?? "")); setEditing(true); }}
              className="p-1 text-[var(--asari-charcoal)]/40 hover:text-[var(--asari-gold)] rounded" title="Update followers">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          ) : (
            <div title="Edit hanya tersedia tanggal 1" className="p-1 text-[var(--asari-charcoal)]/20 cursor-not-allowed">
              <Lock className="h-3.5 w-3.5" />
            </div>
          )
        )}
      </div>

      {editing ? (
        <div className="space-y-2 mt-1">
          <input type="number" value={input} onChange={(e) => setInput(e.target.value)}
            className="w-full border border-[var(--asari-gold)] rounded-lg px-3 py-2 text-2xl font-display focus:outline-none"
            placeholder="0" autoFocus onKeyDown={(e) => e.key === "Enter" && handleSave()} />
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--asari-gold)] text-white py-1.5 rounded-lg text-xs font-semibold disabled:opacity-60">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Simpan
            </button>
            <button onClick={() => setEditing(false)}
              className="flex-1 flex items-center justify-center gap-1.5 border border-[var(--asari-blush-light)] py-1.5 rounded-lg text-xs text-[var(--asari-charcoal)]">
              <X className="h-3.5 w-3.5" /> Batal
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-end justify-between mt-2">
          <p className="font-display text-5xl">
            {value !== null
              ? value.toLocaleString("id-ID")
              : <span className="text-[var(--asari-charcoal)]/30 text-3xl">—</span>
            }
          </p>
          {pct !== null && (
            <span className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${
              up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(pct)}%
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--asari-charcoal)]/50">
        <CalendarClock className="h-3 w-3 shrink-0" />
        <span>
          {canEdit && !isFirstOfMonth
            ? `Edit tersedia setiap tanggal 1${updatedAt ? ` · Terakhir: ${fmtDate(updatedAt)}` : ""}`
            : `Update setiap tanggal 1${updatedAt ? ` · Terakhir: ${fmtDate(updatedAt)}` : ""}`
          }
        </span>
      </div>
    </div>
  );
}

function KpiCard({ label, value, trend, up }: { label: string; value: string; trend: number; up: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[var(--asari-blush-light)] p-6">
      <p className="text-sm text-[var(--asari-charcoal)]/70">{label}</p>
      <div className="flex items-end justify-between mt-2">
        <p className="font-display text-5xl">{value}</p>
        <span className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${
          up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {trend}%
        </span>
      </div>
    </div>
  );
}

function Dashboard() {
  const today = new Date();
  const user = useAuth();
  const owner = isOwner(user);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [reviewMonth, setReviewMonth] = useState(today.getMonth() + 1);
  const [showPicker, setShowPicker] = useState(false);

  const salesData = useMemo(() => generateSalesData(year, month), [year, month]);
  const periodLabel = formatMonthYear(new Date(year, month - 1));
  const reviews = REVIEWS[`${year}-${String(reviewMonth).padStart(2, "0")}`] ?? [];
  const totalOrders = 112;

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
                {[2024, 2025, 2026, today.getFullYear()].filter((v, i, a) => a.indexOf(v) === i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <button onClick={() => setShowPicker(false)} className="w-full mt-2 bg-[var(--asari-gold)] text-white text-xs uppercase py-1.5 rounded">Done</button>
            </div>
          )}
        </div>
      </div>
      <div className="h-px bg-[var(--asari-gold)]" />

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-[var(--asari-blush-light)] p-6">
          <h2 className="font-display text-2xl">Sales Statistics</h2>
          <p className="text-[var(--asari-coral)] text-sm mb-4">{periodLabel}</p>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D9A84E" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#F2DAAC" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8C775E" }} axisLine={{ stroke: "#E8DCC8" }} tickLine={false} />
                <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} tick={{ fontSize: 11, fill: "#8C775E" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`Rp ${v.toLocaleString("id-ID")}`, "Revenue"]}
                  contentStyle={{ borderRadius: 6, border: "1px solid #F2D1B3", fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#D9A84E" strokeWidth={2} fill="url(#goldFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-4">
          <FollowersCard label="Instagram Followers" icon={iconInsta} settingKey="instagram_followers" canEdit={!!owner} />
          <FollowersCard label="TikTok Followers" icon={iconTiktok} settingKey="tiktok_followers" canEdit={!!owner} />
          <KpiCard label="Total Orders" value={totalOrders.toString()} trend={20} up={false} />
        </div>
      </div>

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
                }`}>
                {name}
              </button>
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

const AVATAR_COLORS = ["#F2D0A7", "#F2CDC4", "#F2DAAC", "#EDA28F", "#F2CA7E"];
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