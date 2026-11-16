import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export const NAME_MAX = 40;
export const MESSAGE_MAX = 500;

const clean = (s: string) => s.replace(/[<>]/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();

const schema = z.object({
  name: z.string().transform(clean).pipe(z.string().min(1).max(NAME_MAX)),
  message: z.string().transform(clean).pipe(z.string().min(1).max(MESSAGE_MAX)),
  website: z.string().max(200).optional(), // honeypot
});

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type GuestbookEntry = { id: string; name: string; message: string; created_at: string };

export const listGuestbook = createServerFn({ method: "GET" })
  .inputValidator((d: { offset: number }) => ({ offset: Math.max(0, Math.floor(Number(d.offset) || 0)) }))
  .handler(async ({ data }) => {
    const { data: rows, error } = await publicClient()
      .from("guestbook_messages")
      .select("id, name, message, created_at")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(data.offset, data.offset + 8);
    if (error) { console.error(error); return { items: [] as GuestbookEntry[], error: "load_failed" }; }
    return { items: rows as GuestbookEntry[], error: null };
  });

export const submitGuestbook = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const, entry: null };
    const { data: row, error } = await publicClient()
      .from("guestbook_messages")
      .insert({ name: data.name, message: data.message })
      .select("id, name, message, created_at")
      .single();
    if (error) {
      const m = error.message ?? "";
      return { ok: false as const, error: m.includes("duplicate") ? "duplicate" : m.includes("rate_limited") ? "rate_limited" : "failed" };
    }
    return { ok: true as const, entry: row as GuestbookEntry };
  });
