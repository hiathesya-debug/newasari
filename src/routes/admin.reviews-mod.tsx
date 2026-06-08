import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, X, Loader2, MessageSquare } from "lucide-react";
import { listAllReviews, moderateReview, type ReviewRow, type ReviewStatus } from "@/lib/reviews";
import { timeAgo } from "@/lib/format";

export const Route = createFileRoute("/admin/reviews-mod")({
  head: () => ({ meta: [{ title: "Reviews — Asari Admin" }] }),
  component: ReviewsAdmin,
});

type Filter = "Semua" | "pending" | "approved" | "rejected";

const FILTER_TABS: { key: Filter; label: string }[] = [
  { key: "Semua",    label: "Semua" },
  { key: "pending",  label: "Menunggu" },
  { key: "approved", label: "Disetujui" },
  { key: "rejected", label: "Ditolak" },
];

const STATUS_STYLE: Record<ReviewStatus, string> = {
  pending:  "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

const STATUS_LABEL: Record<ReviewStatus, string> = {
  pending:  "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
};

function ReviewsAdmin() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [acting, setActing] = useState<string | null>(null); // id yang sedang diproses

  const load = () => {
    setLoading(true);
    listAllReviews().then((r) => { setReviews(r); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handle = async (id: string, status: "approved" | "rejected") => {
    setActing(id);
    try {
      await moderateReview(id, status);
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    } catch {
      alert("Gagal memperbarui status review.");
    }
    setActing(null);
  };

  const filtered = filter === "Semua" ? reviews : reviews.filter((r) => r.status === filter);
  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">Reviews</h1>
          <p className="text-sm text-[var(--asari-charcoal)]/60 mt-1">
            Moderasi review dari pelanggan.
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            {pendingCount} menunggu persetujuan
          </span>
        )}
      </div>
      <div className="h-px bg-[var(--asari-gold)]" />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map(({ key, label }) => {
          const count = key === "Semua" ? reviews.length : reviews.filter((r) => r.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-full inline-flex items-center gap-1.5 ${
                filter === key
                  ? "bg-[var(--asari-charcoal)] text-white"
                  : "border border-[var(--asari-charcoal)]/30 hover:border-[var(--asari-gold)]"
              }`}
            >
              {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                filter === key ? "bg-white/20" : "bg-[var(--asari-champagne)]"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="animate-spin text-[var(--asari-gold)] h-6 w-6" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-12 text-center">
          <MessageSquare className="h-10 w-10 text-[var(--asari-blush-light)] mx-auto mb-3" />
          <p className="text-sm text-[var(--asari-charcoal)]/60">Tidak ada review di kategori ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id}
              className={`bg-white rounded-lg border p-5 ${
                r.status === "pending"
                  ? "border-amber-200 shadow-sm"
                  : "border-[var(--asari-blush-light)]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-[var(--asari-charcoal)]">
                      {r.is_anonymous ? "Anonymous" : (r.name ?? "—")}
                    </span>
                    {r.product_name && (
                      <span className="text-[10px] uppercase tracking-widest bg-[var(--asari-peach)]/30 text-[var(--asari-charcoal)] px-2 py-0.5 rounded-full">
                        {r.product_name}
                      </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                  <p className="text-[13px] text-[var(--asari-charcoal)]/80 leading-relaxed mb-2">
                    {r.review_text}
                  </p>
                  <p className="text-[11px] text-[var(--asari-charcoal)]/40">
                    {timeAgo(new Date(r.created_at))}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  {r.status !== "approved" && (
                    <button
                      onClick={() => handle(r.id, "approved")}
                      disabled={acting === r.id}
                      title="Setujui"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 text-xs font-medium disabled:opacity-50"
                    >
                      {acting === r.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Check className="h-3.5 w-3.5" />
                      }
                      Setujui
                    </button>
                  )}
                  {r.status !== "rejected" && (
                    <button
                      onClick={() => handle(r.id, "rejected")}
                      disabled={acting === r.id}
                      title="Tolak"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-xs font-medium disabled:opacity-50"
                    >
                      {acting === r.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <X className="h-3.5 w-3.5" />
                      }
                      Tolak
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}