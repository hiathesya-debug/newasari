// Helpers for the orders table. RLS enforces access (customer sees own; staff sees all).
import { supabase } from "@/integrations/supabase/client";

export type DbOrderStatus =
  | "Pending"
  | "Dikonfirmasi"
  | "Diproses"
  | "Siap"
  | "Selesai"
  | "Dibatalkan";

export type DbOrder = {
  id: string;
  customer_name: string;
  whatsapp: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  paper_bag: number;
  method: string;
  address: string | null;
  pickup_date: string;
  pickup_time: string;
  total: number;
  status: DbOrderStatus;
  source: string;
  notes: string | null;
  customer_note: string | null;
  customer_id: string | null;
  created_at: string;
  updated_at: string;
};

export async function listOrders(): Promise<DbOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("listOrders", error);
    return [];
  }
  return (data ?? []) as DbOrder[];
}

export async function listMyOrders(): Promise<DbOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("listMyOrders", error);
    return [];
  }
  return (data ?? []) as DbOrder[];
}

export async function getOrder(id: string): Promise<DbOrder | null> {
  const { data } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  return (data as DbOrder | null) ?? null;
}

async function nextOrderId(): Promise<string> {
  const { count } = await supabase.from("orders").select("*", { count: "exact", head: true });
  const n = (count ?? 0) + 1;
  return `ORD-${String(n).padStart(4, "0")}`;
}

export async function createOrder(input: Omit<DbOrder, "id" | "customer_id" | "created_at" | "updated_at">): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const id = await nextOrderId();
  const { error } = await supabase.from("orders").insert({ id, ...input });
  if (error) return { ok: false, error: error.message };
  return { ok: true, id };
}

export async function updateOrder(id: string, patch: Partial<DbOrder>): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error } = await supabase.from("orders").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function countPendingReviews(): Promise<number> {
  const { count } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");
  return count ?? 0;
}
