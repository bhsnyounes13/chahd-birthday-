import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MESSAGE_MAX, NAME_MAX, submitGuestbook, type GuestbookEntry } from "@/lib/guestbook.functions";

const ERRORS: Record<string, string> = {
  duplicate: "This message was already sent 💜 · هذه الرسالة أُرسلت من قبل",
  rate_limited: "Too many messages right now — try again in a moment. · حاول بعد قليل",
  failed: "Something went wrong, please try again. · حدث خطأ، حاول مرة أخرى",
};

export function MessageForm({ onAdded }: { onAdded: (e: GuestbookEntry) => void }) {
  const submit = useServerFn(submitGuestbook);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const lock = useRef(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lock.current) return;
    const n = name.trim(), m = message.trim();
    if (!n || !m) return setError("Please write your name and a message. · اكتب اسمك ورسالتك");
    if (/[<>]/.test(n + m)) return setError("Please remove the < and > characters.");
    lock.current = true; setBusy(true); setError(null);
    try {
      const res = await submit({ data: { name: n, message: m, website: hp } });
      if (res.ok) {
        if (res.entry) onAdded(res.entry);
        setName(""); setMessage(""); setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } else setError(ERRORS[res.error] ?? ERRORS["failed"]!);
    } catch {
      setError(ERRORS["failed"]!);
    } finally { lock.current = false; setBusy(false); }
  };

  const field = "w-full rounded-2xl border border-lavender/40 bg-background/40 px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender/40";
  return (
    <motion.form onSubmit={onSubmit} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="glass relative mx-auto mt-10 max-w-2xl space-y-4 rounded-[2rem] p-6 shadow-glow sm:p-8" noValidate>
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} /></label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-lilac">Your name · اسمك</span>
        <input dir="auto" value={name} maxLength={NAME_MAX} onChange={(e) => setName(e.target.value)} required className={field} placeholder="Your name…" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-lilac">Your birthday message · رسالتك</span>
        <textarea dir="auto" value={message} maxLength={MESSAGE_MAX} onChange={(e) => setMessage(e.target.value)} required rows={5} className={`${field} resize-none`} placeholder="Write something from your heart… اكتب من قلبك" />
        <span className={`mt-1 block text-right text-xs ${message.length >= MESSAGE_MAX ? "text-candle" : "text-muted-foreground"}`}>{message.length}/{MESSAGE_MAX}</span>
      </label>
      {error && <p role="alert" className="text-sm text-candle">{error}</p>}
      <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-royal-gradient px-6 py-3.5 font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>Send Your Love 💜</span><span lang="ar" className="opacity-80">· أرسل رسالتك 💜</span>
      </button>
      <AnimatePresence>
        {success && (
          <motion.p role="status" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center font-display text-lg text-candle">
            Your love was sent! 💜 · وصلت رسالتك!
          </motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
