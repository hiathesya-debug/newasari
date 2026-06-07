import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CustomerLayout } from "@/components/CustomerLayout";
import { listApprovedReviews, submitReview, type ReviewRow } from "@/lib/review";
import { PRODUCTS } from "@/lib/mockData";
import { useAuth } from "@/lib/auth";
import { timeAgo } from "@/lib/format";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Customer Reviews — Asari Bouquet & Flower" },
      { name: "description", content: "What our customers say about Asari Bouquet & Flower." },
    ],
  }),
  component: ReviewsPage,
});

const MONTHS = [
  "All", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthIdx, setMonthIdx] = useState(new Date().getMonth() + 1); // 1-12; 0 = All
  const [showForm, setShowForm] = useState(false);

  const refresh = () => listApprovedReviews().then((r) => { setReviews(r); setLoading(false); });
  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => {
    if (monthIdx === 0) return reviews;
    return reviews.filter((r) => new Date(r.created_at).getMonth() + 1 === monthIdx);
  }, [reviews, monthIdx]);

  return (
    <CustomerLayout>
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
          <div>
            <h1 className="font-display text-5xl">
              <span className="italic">Customer</span> Reviews
            </h1>
            <p className="text-sm text-[var(--asari-coral)] mt-2">
              What our customers say about Asari Bouquet &amp; Flower
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="border border-[var(--asari-gold)] text-[var(--asari-gold)] px-5 py-2.5 rounded uppercase text-xs tracking-widest hover:bg-[var(--asari-gold)] hover:text-white transition-colors"
          >
            {showForm ? "Tutup Form" : "Write a Review"}
          </button>
        </div>
        <div className="h-px bg-[var(--asari-gold)] my-6" />

        {showForm && <ReviewForm onDone={() => { setShowForm(false); refresh(); }} />}

        <div className="flex gap-2 overflow-x-auto pb-4 mt-8 mb-6">
          {MONTHS.map((name, idx) => {
            const active = monthIdx === idx;
            return (
              <button
                key={name}
                onClick={() => setMonthIdx(idx)}
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

        {loading ? (
          <p className="text-sm text-[var(--asari-charcoal)]/60">Memuat review...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-[var(--asari-charcoal)]/60">
            <div className="text-4xl mb-3">🌸</div>
            <p>No reviews yet for this period.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </section>
    </CustomerLayout>
  );
}

const AVATAR_COLORS = ["#F2D0A7", "#F2CDC4", "#F2DAAC", "#EDA28F", "#F2CA7E"];

function ReviewCard({ review }: { review: ReviewRow }) {
  const [expanded, setExpanded] = useState(false);
  const displayName = review.is_anonymous ? "Anonymous" : (review.name ?? "Anonymous");
  const initial = displayName.charAt(0).toUpperCase();
  const color = AVATAR_COLORS[displayName.length % AVATAR_COLORS.length];

  return (
    <div className="border border-[var(--asari-blush-light)] rounded-lg p-5 bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium text-white"
          style={{ backgroundColor: color }}
        >
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{displayName}</p>
          <p className="text-[11px] text-[var(--asari-charcoal)]/60">{timeAgo(new Date(review.created_at))}</p>
        </div>
      </div>
      {review.product_name && (
        <span className="inline-block text-[10px] uppercase tracking-widest bg-[var(--asari-peach)]/30 text-[var(--asari-charcoal)] px-2 py-0.5 rounded-full mb-2">
          {review.product_name}
        </span>
      )}
      <p className={`text-sm text-[var(--asari-charcoal)] ${expanded ? "" : "line-clamp-3"}`}>
        {review.review_text}
      </p>
      {review.review_text.length > 140 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-[var(--asari-gold)] mt-2 underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

function ReviewForm({ onDone }: { onDone: () => void }) {
  const user = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [anonymous, setAnonymous] = useState(false);
  const [productId, setProductId] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (user?.name) setName(user.name); }, [user?.name]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const product = PRODUCTS.find((p) => p.id === productId);
    const res = await submitReview({
      name,
      isAnonymous: anonymous,
      productId: product?.id ?? null,
      productName: product?.name ?? null,
      reviewText: text,
    });
    setSubmitting(false);
    if (!res.ok) { setError(res.error); return; }
    setSuccess(true);
    setText("");
    setTimeout(() => { setSuccess(false); onDone(); }, 2500);
  };

  return (
    <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6 mt-2">
      <h2 className="font-display text-2xl mb-4">Tulis Review</h2>
      {success ? (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-4">
          Terima kasih! Review Anda sedang diperiksa dan akan segera ditampilkan.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-widest">Nama</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={anonymous}
              placeholder="Nama Anda"
              className="mt-1 w-full border border-[var(--asari-blush-light)] rounded px-3 py-2 focus:outline-none focus:border-[var(--asari-gold)] disabled:bg-[var(--asari-off-white)]"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            Kirim sebagai Anonymous
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest">Produk (opsional)</span>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mt-1 w-full border border-[var(--asari-blush-light)] rounded px-3 py-2 focus:outline-none focus:border-[var(--asari-gold)]"
            >
              <option value="">— Other / Not specified —</option>
              {PRODUCTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest">Review *</span>
            <textarea
              required
              minLength={10}
              maxLength={500}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Tell us about your experience ordering from Asari..."
              className="mt-1 w-full border border-[var(--asari-blush-light)] rounded px-3 py-2 focus:outline-none focus:border-[var(--asari-gold)]"
            />
            <p className="text-[11px] text-[var(--asari-charcoal)]/60 mt-1">{text.length}/500 — minimal 10 karakter</p>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[var(--asari-gold)] text-white py-2.5 rounded uppercase text-xs tracking-widest hover:bg-[var(--asari-gold-light)] disabled:opacity-60"
          >
            {submitting ? "Mengirim..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}
