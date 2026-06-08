import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
} from "recharts";
import { generateSalesData, REVIEWS } from "@/lib/mockData";
import { formatMonthYear, timeAgo } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard — Asari Admin" }] }),
  component: Dashboard,
});

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function Dashboard() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [reviewMonth, setReviewMonth] = useState(today.getMonth() + 1);
  const [showPicker, setShowPicker] = useState(false);

  const salesData = useMemo(() => generateSalesData(year, month), [year, month]);
  const periodLabel = formatMonthYear(new Date(year, month - 1));
  const reviews = REVIEWS[`${year}-${String(reviewMonth).padStart(2, "0")}`] ?? [];

  const totalFollowers = 2205;
  const totalOrders = 112;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl md:text-5xl">Dashboard</h1>
        <div className="relative">
          <button
            onClick={() => setShowPicker((v) => !v)}
            className="text-sm flex items-center gap-2"
          >
            <span className="text-[var(--asari-charcoal)]">Period:</span>
            <span className="text-[var(--asari-coral)] font-medium">{periodLabel}</span>
          </button>
          {showPicker && (
            <div className="absolute right-0 mt-2 bg-white border border-[var(--asari-blush-light)] rounded shadow p-3 z-10 w-48">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full mb-2 border rounded px-2 py-1 text-sm"
              >
                {MONTH_NAMES.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                {[2024, 2025, 2026, today.getFullYear()].filter((v, i, a) => a.indexOf(v) === i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <button
                onClick={() => setShowPicker(false)}
                className="w-full mt-2 bg-[var(--asari-gold)] text-white text-xs uppercase py-1.5 rounded"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="h-px bg-[var(--asari-gold)]" />

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        {/* Sales Statistics */}
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
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#8C775E" }}
                  axisLine={{ stroke: "#E8DCC8" }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                  tick={{ fontSize: 11, fill: "#8C775E" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v: number) => [`Rp ${v.toLocaleString("id-ID")}`, "Revenue"]}
                  contentStyle={{ borderRadius: 6, border: "1px solid #F2D1B3", fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#D9A84E"
                  strokeWidth={2}
                  fill="url(#goldFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-6">
          <KpiCard
            label="Total Followers"
            value={totalFollowers.toLocaleString("id-ID")}
            trend={10}
            up
          />
          <KpiCard
            label="Total Orders"
            value={totalOrders.toString()}
            trend={20}
            up={false}
          />
        </div>
      </div>

      {/* All Review */}
      <div className="bg-white rounded-lg shadow-sm border border-[var(--asari-blush-light)] p-6">
        <h2 className="font-display text-2xl mb-4">
          <span className="italic">All</span> Review
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
          {MONTH_NAMES.slice(1).map((name, idx) => {
            const num = idx + 2;
            const active = num === reviewMonth;
            return (
              <button
                key={name}
                onClick={() => setReviewMonth(num)}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
                  active
                    ? "bg-[var(--asari-charcoal)] text-white"
                    : "border border-[var(--asari-charcoal)]/30 text-[var(--asari-charcoal)] hover:border-[var(--asari-gold)]"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.length === 0 && (
            <p className="text-sm text-[var(--asari-charcoal)]/60">Belum ada review untuk bulan ini.</p>
          )}
          {reviews.map((r) => (
            <ReviewCard key={r.id} name={r.name} when={timeAgo(r.date)} text={r.text} />
          ))}
        </div>
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
        <span
          className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${
            up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {trend}%
        </span>
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
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium text-white"
          style={{ backgroundColor: color }}
        >
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{name}</p>
          <p className="text-[11px] text-[var(--asari-charcoal)]/60">{when}</p>
        </div>
      </div>
      <p className="text-[13px] text-[var(--asari-charcoal)] line-clamp-3">{text}</p>
    </div>
  );
}
