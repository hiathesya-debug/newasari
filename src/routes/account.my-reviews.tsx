import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, MessageSquare, PenLine, Quote } from "lucide-react";
import { listMyReviews, listApprovedReviews, type ReviewRow, type ReviewStatus } from "@/lib/reviews";
import { timeAgo } from "@/lib/format";

export const Route = createFileRoute("/account/my-reviews")({
  head: () => ({ meta: [{ title: "My Reviews — Asari" }] }),
  component: MyReviewsPage,
});

const STATUS_STYLE: Record<ReviewStatus, string> = {
  pending:  "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100   text-red-600",
};
const STATUS_LABEL: Record<ReviewStatus, string> = {
  pending:  "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
};

type Filter = "all" | ReviewStatus;
const TABS: { key: Filter; label: string }[] = [
  { key: "all",      label: "Semua"    },
  { key: "pending",  label: "Menunggu" },
  { key: "approved", label: "Disetujui" },
  { key: "rejected", label: "Ditolak"  },
];

/** Pick one random anonymous approved review */
function pickRandom(pool: ReviewRow[]): ReviewRow | null {
  const anon = pool.filter((r) => r.is_anonymous && r.status === "approved");
  if (!anon.length) return null;
  return anon[Math.floor(Math.random() * anon.length)];
}

function MyReviewsPage() {
  const [myReviews,   setMyReviews]   = useState<ReviewRow[]>([]);
  const [spotlight,   setSpotlight]   = useState<ReviewRow | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState<Filter>("all");

  useEffect(() => {
    Promise.all([listMyReviews(), listApprovedReviews()]).then(([mine, approved]) => {
      setMyReviews(mine);
      setSpotlight(pickRandom(approved));
      setLoading(false);
    });
  }, []);

  const filtered = filter === "all" ? myReviews : myReviews.filter((r) => r.status === filter);
  const count = (k: Filter) => k === "all" ? myReviews.length : myReviews.filter((r) => r.status === k).length;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">My Reviews</h1>
          <p className="text-sm text-[var(--asari-charcoal)]/60 mt-1">
            Review yang kamu kirimkan ke Asari.
          </p>
        </div>
        <Link
          to="/reviews"
          className="shrink-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest border border-[var(--asari-gold)] text-[var(--asari-gold)] px-4 py-2 hover:bg-[var(--asari-gold)] hover:text-white transition-colors"
        >
          <PenLine className="h-3.5 w-3.5" />
          Tulis Review
        </Link>
      </div>
      <div className="h-px bg-[var(--asari-gold)]" />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-full inline-flex items-center gap-1.5 ${
              filter === key
                ? "bg-[var(--asari-charcoal)] text-white"
                : "border border-[var(--asari-charcoal)]/30 text-[var(--asari-charcoal)] hover:border-[var(--asari-gold)]"
            }`}
          >
            {label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === key ? "bg-white/20" : "bg-[var(--asari-champagne)]"}`}>
              {count(key)}
            </span>
          </button>
        ))}
      </div>

      {/* Review list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-[var(--asari-gold)] h-6 w-6" />
        </div>

      ) : myReviews.length === 0 ? (
        /* ── Empty state: no reviews yet ── */
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-10 text-center">
            <MessageSquare className="h-10 w-10 text-[var(--asari-blush-light)] mx-auto mb-3" />
            <p className="text-sm text-[var(--asari-charcoal)]/60 mb-4">
              Kamu belum pernah menulis review.
            </p>
            <Link to="/reviews"
              className="text-xs uppercase tracking-widest text-[var(--asari-gold)] border border-[var(--asari-gold)] px-4 py-2 hover:bg-[var(--asari-gold)] hover:text-white transition-colors"
            >
              Tulis Review Sekarang
            </Link>
          </div>

          {/* Random anonymous review spotlight */}
          {spotlight && (
            <div className="bg-[var(--asari-champagne)]/30 rounded-lg border border-[var(--asari-blush-light)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Quote className="h-4 w-4 text-[var(--asari-gold)] shrink-0" />
                <p className="text-xs uppercase tracking-widest text-[var(--asari-brown)]">
                  Review dari pelanggan kami
                </p>
              </div>
              {spotlight.product_name && (
                <span className="inline-block text-[10px] uppercase tracking-widest bg-[var(--asari-peach)]/40 text-[var(--asari-charcoal)] px-2 py-0.5 rounded-full mb-2">
                  {spotlight.product_name}
                </span>
              )}
              <p className="text-sm text-[var(--asari-charcoal)] leading-relaxed italic">
                "{spotlight.review_text}"
              </p>
              <p className="text-[11px] text-[var(--asari-charcoal)]/50 mt-2">
                — Anonim · {timeAgo(spotlight.created_at)}
              </p>
            </div>
          )}
        </div>

      ) : filtered.length === 0 ? (
        <p className="text-sm text-[var(--asari-charcoal)]/60 py-8 text-center">
          Tidak ada review dengan status ini.
        </p>

      ) : (
        /* ── Customer's own reviews ── */
        <div className="space-y-3">
          {filtered.map((r) => <ReviewItem key={r.id} review={r} />)}
        </div>
      )}
    </div>
  );
}

/* ── Single review item (read-only) ─────────────────────────────────────────── */
function ReviewItem({ review: r }: { review: ReviewRow }) {
  return (
    <div className={`bg-white rounded-lg border p-5 ${
      r.status === "pending" ? "border-amber-200" : "border-[var(--asari-blush-light)]"
    }`}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="font-medium text-sm text-[var(--asari-charcoal)]">
          {r.is_anonymous ? "Anonim" : (r.name ?? "—")}
        </span>
        {r.product_name && (
          <span className="text-[10px] uppercase tracking-widest bg-[var(--asari-peach)]/30 text-[var(--asari-charcoal)] px-2 py-0.5 rounded-full">
            {r.product_name}
          </span>
        )}
        {/* Status badge — read-only, NO approve/reject buttons */}
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[r.status]}`}>
          {STATUS_LABEL[r.status]}
        </span>
      </div>

      <p className="text-[13px] text-[var(--asari-charcoal)]/80 leading-relaxed mb-2">
        {r.review_text}
      </p>
      <p className="text-[11px] text-[var(--asari-charcoal)]/40">{timeAgo(r.created_at)}</p>

      {r.status === "pending" && (
        <p className="text-[11px] text-amber-600/70 mt-2">
          Review kamu sedang menunggu persetujuan dari Asari.
        </p>
      )}
      {r.status === "rejected" && (
        <p className="text-[11px] text-red-500/70 mt-2">
          Review ini tidak disetujui dan tidak ditampilkan secara publik.
        </p>
      )}
    </div>
  );
}
