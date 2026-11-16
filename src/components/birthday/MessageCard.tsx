import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { GuestbookEntry } from "@/lib/guestbook.functions";

const EMOJIS = ["🌸", "💜", "🦋", "✨", "🌷", "🎀", "🧸", "💐"];
const isArabic = (t: string) => /[\u0600-\u06FF]/.test(t);
const emojiFor = (id: string) => EMOJIS[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % EMOJIS.length];

export function MessageCard({ item, open, onToggle, index }: { item: GuestbookEntry; open: boolean; onToggle: () => void; index: number }) {
  const ar = isArabic(item.message);
  const long = item.message.length > 140;
  const date = new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      className={`relative min-w-0 rounded-3xl border border-lavender/30 bg-card p-6 text-card-foreground transition-shadow ${open ? "shadow-glow ring-2 ring-lavender" : "shadow-lg hover:-translate-y-1 hover:shadow-glow"}`}
    >
      <button onClick={long ? onToggle : undefined} aria-expanded={long ? open : undefined} className={`block w-full text-left focus-visible:outline-none ${long ? "" : "cursor-default"}`}>
        <div className="flex items-center gap-3 pr-8">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lilac text-xl">{emojiFor(item.id)}</span>
          <div className="min-w-0">
            <h3 dir="auto" className="truncate font-display text-xl font-semibold text-violet">{item.name}</h3>
            <p className="text-xs text-royal">{date}</p>
          </div>
        </div>
        <p dir={ar ? "rtl" : "ltr"} lang={ar ? "ar" : undefined} className={`mt-4 whitespace-pre-line break-words leading-relaxed text-card-foreground/85 ${open || !long ? "" : "line-clamp-4"}`}>
          {item.message}
        </p>
        {long && <p className="mt-3 text-sm font-medium text-royal">{open ? "Show less" : "Read more 💌"}</p>}
      </button>
      {open && (
        <button onClick={onToggle} aria-label="Close message" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full text-royal hover:bg-lilac">
          <X className="h-5 w-5" />
        </button>
      )}
    </motion.article>
  );
}
