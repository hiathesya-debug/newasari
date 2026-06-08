// Helpers around the reviews table. Uses the browser Supabase client; RLS enforces access.
import { supabase } from "@/integrations/supabase/client";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type ReviewRow = {
  id: string;
  name: string | null;
  is_anonymous: boolean;
  product_id: string | null;
  product_name: string | null;
  review_text: string;
  status: ReviewStatus;
  created_at: string;
  reviewed_at: string | null;
};

const RL_KEY = "asari_review_rl";
const MAX_PER_DAY = 3;

function checkClientRateLimit(): { ok: boolean; remaining: number } {
  if (typeof window === "undefined") return { ok: true, remaining: MAX_PER_DAY };
  try {
    const raw = localStorage.getItem(RL_KEY);
    const now = Date.now();
    const arr: number[] = raw ? JSON.parse(raw) : [];
    const fresh = arr.filter((t) => now - t < 24 * 60 * 60 * 1000);
    return { ok: fresh.length < MAX_PER_DAY, remaining: MAX_PER_DAY - fresh.length };
  } catch {
    return { ok: true, remaining: MAX_PER_DAY };
  }
}

function recordSubmission() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(RL_KEY);
    const arr: number[] = raw ? JSON.parse(raw) : [];
    arr.push(Date.now());
    localStorage.setItem(RL_KEY, JSON.stringify(arr.slice(-10)));
  } catch {
    /* ignore */
  }
}

const BAD_WORDS = ["fuck", "shit", "bangsat", "anjing", "kontol", "memek", "ngentot"];

export function containsProfanity(text: string): boolean {
  const t = text.toLowerCase();
  return BAD_WORDS.some((w) => t.includes(w));
}

export async function submitReview(input: {
  name: string;
  isAnonymous: boolean;
  productId?: string | null;
  productName?: string | null;
  reviewText: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!input.isAnonymous && !input.name.trim()) {
    return { ok: false, error: "Nama wajib diisi atau centang anonim." };
  }
  const text = input.reviewText.trim();
  if (text.length < 10) return { ok: false, error: "Review minimal 10 karakter." };
  if (text.length > 500) return { ok: false, error: "Review maksimal 500 karakter." };
  if (containsProfanity(text)) return { ok: false, error: "Mohon gunakan bahasa yang sopan." };

  const { data: userResp } = await supabase.auth.getUser();
  const customerId = userResp.user?.id ?? null;

  const { error } = await supabase.from("reviews").insert({
    name: input.isAnonymous ? null : input.name.trim(),
    is_anonymous: input.isAnonymous,
    product_id: input.productId ?? null,
    product_name: input.productName ?? null,
    review_text: text,
    status: "pending",
    customer_id: customerId,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function listApprovedReviews(): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as ReviewRow[];
}

export async function listAllReviews(): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as ReviewRow[];
}

export async function moderateReview(id: string, status: "approved" | "rejected") {
  const { error } = await supabase
    .from("reviews")
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}