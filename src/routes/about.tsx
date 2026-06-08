import { createFileRoute } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/CustomerLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Asari Bouquet & Flower" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="font-display text-5xl text-center mb-10">About Us</h1>
        <div className="space-y-6 text-sm text-[var(--asari-charcoal)] leading-relaxed text-center">
          <p>
            Asari Bouquet & Flower adalah florist rumahan yang berlokasi di Antapani, Bandung.
            Kami menghadirkan rangkaian bunga segar dan kering dengan sentuhan personal untuk
            berbagai momen spesial.
          </p>
          <p>
            Hubungi kami di WhatsApp +62 878-6391-2739 atau Instagram @asari.bouquetflowerbdg.
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
}