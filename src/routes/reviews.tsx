import { createFileRoute } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/CustomerLayout";
import { useEffect, useState } from "react";
import { listApprovedReviews, submitReview, type ReviewRow } from "@/lib/reviews";
import { timeAgo } from "@/lib/format";
import { Loader2, X, Plus } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [{ title: "Reviews — Asari Bouquet & Flower" }],
  }),
  component: ReviewsPage,
});

function ReviewCard({ review }: { review: ReviewRow }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 150;

  const text = review.review_text;
  const isLong = text.length > MAX_LENGTH;
  const displayText = isLong && !isExpanded ? text.slice(0, MAX_LENGTH).trim() + "..." : text;

  return (
    <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-5 flex flex-col h-full shadow-sm">
      <div className="flex-1 min-w-0 mb-3">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="font-medium text-sm text-[var(--asari-charcoal)]">
            {review.is_anonymous ? "Anonim" : (review.name ?? "—")}
          </span>
          {review.product_name && (
            <span className="text-[10px] uppercase tracking-widest bg-[var(--asari-peach)]/30 text-[var(--asari-charcoal)] px-2 py-0.5 rounded-full truncate max-w-[120px]">
              {review.product_name}
            </span>
          )}
        </div>
        <p className="text-[13px] text-[var(--asari-charcoal)]/80 leading-relaxed whitespace-pre-wrap break-words">
          {displayText}
          {isLong && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[var(--asari-gold)] ml-1 font-semibold hover:underline focus:outline-none"
            >
              {isExpanded ? "Read less" : "Read more"}
            </button>
          )}
        </p>
      </div>
      <p className="text-[11px] text-[var(--asari-charcoal)]/40 mt-auto">
        {timeAgo(new Date(review.created_at))}
      </p>
    </div>
  );
}

function ReviewForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [productName, setProductName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const res = await submitReview({
      name,
      isAnonymous,
      productName,
      reviewText,
    });

    if (res.ok) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage(res.error);
    }
  };

  if (status === "success") {
    return (
      <div className="p-10 text-center">
        <h3 className="font-display text-3xl text-[var(--asari-gold)] mb-3">Terima Kasih!</h3>
        <p className="text-sm text-[var(--asari-charcoal)]/80 mb-8">
          Review Anda telah berhasil dikirim dan sedang menunggu persetujuan admin.
        </p>
        <button 
          onClick={onClose}
          className="bg-[var(--asari-gold)] text-white text-xs uppercase tracking-[0.2em] font-medium px-8 py-3 rounded hover:bg-[var(--asari-gold)]/90 transition-colors"
        >
          Tutup
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8">
      <h3 className="font-display text-2xl md:text-3xl text-center mb-6 text-[var(--asari-charcoal)] pr-6">
        Bagikan Pengalaman Anda
      </h3>
      
      {status === "error" && (
        <div className="bg-red-50 text-red-600 border border-red-200 text-sm p-3 rounded mb-6">
          {errorMessage}
        </div>
      )}

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-[var(--asari-charcoal)]/60">Nama</label>
            <input
              type="text"
              disabled={isAnonymous}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
              className="w-full border border-[var(--asari-blush-light)] rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--asari-gold)] disabled:bg-gray-50 disabled:text-gray-400"
            />
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-[var(--asari-blush-light)] text-[var(--asari-gold)] focus:ring-[var(--asari-gold)]"
              />
              <span className="text-xs text-[var(--asari-charcoal)]/80">Sembunyikan nama (Anonim)</span>
            </label>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-[var(--asari-charcoal)]/60">Produk (Opsional)</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Cth: Custom Red Roses"
              className="w-full border border-[var(--asari-blush-light)] rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--asari-gold)]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-[var(--asari-charcoal)]/60">Review (Maks 500 Karakter)</label>
          <textarea
            required
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Bagaimana hasil pesanan bunga Anda?"
            rows={4}
            maxLength={500}
            className="w-full border border-[var(--asari-blush-light)] rounded px-4 py-3 text-sm focus:outline-none focus:border-[var(--asari-gold)] resize-none"
          />
          <div className="text-right text-[10px] text-[var(--asari-charcoal)]/40">
            {reviewText.length}/500
          </div>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-[var(--asari-gold)] text-white text-xs uppercase tracking-[0.2em] font-medium py-3.5 rounded hover:bg-[var(--asari-gold)]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
          Kirim Review
        </button>
      </div>
    </form>
  );
}

function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    listApprovedReviews().then(setReviews);
  }, []);

  // Prevent scrolling on the background when the modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-6 py-20 min-h-[70vh]">
        
        {/* Header Section with Title and Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 border-b border-[var(--asari-blush-light)] pb-6">
          <h1 className="font-display text-5xl text-[var(--asari-charcoal)]">Reviews</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[var(--asari-gold)] text-white text-xs uppercase tracking-[0.15em] font-medium px-6 py-3 rounded hover:bg-[var(--asari-gold)]/90 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Write a Review
          </button>
        </div>

        {/* Existing Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-[var(--asari-charcoal)]/60 mb-4">
              Belum ada review yang tersedia.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs uppercase tracking-widest text-[var(--asari-gold)] hover:underline"
            >
              Jadilah yang pertama mereview!
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )}
      </div>

      {/* Pop-up Overlay (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#26160e]/40 backdrop-blur-sm p-4 overflow-y-auto">
          {/* Click outside to close (optional, but good UX) */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[var(--asari-charcoal)]/40 hover:text-[var(--asari-charcoal)] hover:bg-[var(--asari-blush-light)] rounded-full transition-colors focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
            
            <ReviewForm onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}