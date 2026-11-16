import { motion } from "framer-motion";
import { Flower2, X } from "lucide-react";
import type { GirlMessage } from "@/content/birthday";

// Right-to-left only when the message starts in Arabic; mixed messages stay left-to-right.
const isArabic = (t: string) => /^[^\p{L}]*[\u0600-\u06FF]/u.test(t);

export function MessageCard({ item, open, onToggle, index }: { item: GirlMessage; open: boolean; onToggle: () => void; index: number }) {
  const ar = isArabic(item.message);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08, layout: { duration: 0.45 } }}
      className={`relative rounded-3xl bg-card p-6 text-card-foreground transition-shadow ${open ? "shadow-glow ring-2 ring-lavender sm:col-span-2" : "shadow-lg hover:-translate-y-1 hover:shadow-glow"}`}
    >
      <button onClick={onToggle} aria-expanded={open} className="block w-full text-left focus-visible:outline-none">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lilac text-xl">{item.emoji ?? "💜"}</span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-royal">From</p>
            <h3 className="truncate font-display text-xl font-semibold text-violet">{item.name}</h3>
          </div>
          <Flower2 className="ml-auto h-5 w-5 shrink-0 text-lavender" />
        </div>
        <motion.p layout="position" dir={ar ? "rtl" : "ltr"} lang={ar ? "ar" : undefined} className={`mt-4 whitespace-pre-line leading-relaxed text-card-foreground/85 ${open ? "" : "line-clamp-3"}`}>
          {item.message}
        </motion.p>
        <p className="mt-4 text-sm font-medium text-royal">{open ? "" : "Tap to read 💌"}</p>
      </button>
      {open && (
        <button onClick={onToggle} aria-label="Close message" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full text-royal hover:bg-lilac">
          <X className="h-5 w-5" />
        </button>
      )}
    </motion.article>
  );
}
