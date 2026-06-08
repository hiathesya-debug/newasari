import { createFileRoute } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/CustomerLayout";
import { useEffect, useState } from "react";
import { listApprovedReviews, type ReviewRow } from "@/lib/reviews";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [{ title: "Reviews — Asari Bouquet & Flower" }],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);

  useEffect(() => {
    listApprovedReviews().then(setReviews);
  }, []);

  return (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="font-display text-5xl text-center mb-10">Reviews</h1>
        {reviews.length === 0 ? (
          <p className="text-center text-sm text-[var(--asari-charcoal)]/60">
            Belum ada review yang tersedia.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="border border-[var(--asari-blush-light)] rounded p-4">
                <p className="text-sm font-medium">{r.is_anonymous ? "Anonim" : r.name}</p>
                {r.product_name && (
                  <p className="text-xs text-[var(--asari-gold)] mb-1">{r.product_name}</p>
                )}
                <p className="text-sm text-[var(--asari-charcoal)]">{r.review_text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}