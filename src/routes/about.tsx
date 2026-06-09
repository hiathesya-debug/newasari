import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CustomerLayout } from "@/components/CustomerLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Asari Bouquet & Flower" },
      { name: "description", content: "Florist rumahan di Antapani, Bandung. Setiap rangkaian kami kerjakan dengan tangan, dari hati." },
    ],
  }),
  component: About,
});

const DEFAULT_PARA1 = "Asari Bouquet & Flower adalah florist rumahan yang berlokasi di Antapani, Bandung. Kami menghadirkan rangkaian bunga segar dan kering dengan sentuhan personal untuk berbagai momen spesial.";
const DEFAULT_PARA2 = "Hubungi kami di WhatsApp +62 878-6391-2739 atau Instagram @asari.bouquetflowerbdg.";

function About() {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [para1,     setPara1]     = useState(DEFAULT_PARA1);
  const [para2,     setPara2]     = useState(DEFAULT_PARA2);

  useEffect(() => {
    (supabase as any)
      .from("site_settings")
      .select("key,value")
      .in("key", ["about_hero_image", "about_para1", "about_para2"])
      .then(({ data }: { data: { key: string; value: string }[] | null }) => {
        (data ?? []).forEach((row) => {
          if (row.key === "about_hero_image" && row.value) setHeroImage(row.value);
          if (row.key === "about_para1"      && row.value) setPara1(row.value);
          if (row.key === "about_para2"      && row.value) setPara2(row.value);
        });
      });
  }, []);

  return (
    <CustomerLayout>

      {/* Hero photo — shown once admin uploads one */}
      {heroImage && (
        <div className="w-full max-h-[420px] overflow-hidden">
          <img src={heroImage} alt="Asari Bouquet & Flower" className="w-full h-full object-cover" style={{ maxHeight: "420px" }} />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="font-display text-5xl text-center mb-10">About Us</h1>

        <div className="space-y-6 text-sm text-[var(--asari-charcoal)] leading-relaxed text-center">
          {/* Paragraphs loaded from Supabase, fall back to defaults */}
          {para1 && <p>{para1}</p>}
          {para2 && <p>{para2}</p>}
        </div>
      </div>

    </CustomerLayout>
  );
}
