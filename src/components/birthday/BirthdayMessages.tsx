import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listGuestbook, type GuestbookEntry } from "@/lib/guestbook.functions";
import { FloatingParticles } from "./FloatingParticles";
import { MessageCard } from "./MessageCard";
import { MessageForm } from "./MessageForm";
import { SectionHeading } from "./SectionHeading";

const PAGE = 9;

export function BirthdayMessages() {
  const list = useServerFn(listGuestbook);
  const [items, setItems] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const load = async (offset: number) => {
    setLoading(true);
    try {
      const res = await list({ data: { offset } });
      if (res.error) setFailed(true);
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...(offset ? prev : []), ...res.items.filter((r) => !seen.has(r.id) || !offset)];
      });
      setMore(res.items.length === PAGE);
    } catch { setFailed(true); } finally { setLoading(false); }
  };
  useEffect(() => { load(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-28">
      <FloatingParticles count={8} variant="petal" />
      <SectionHeading en="Letters Filled With Love 💜" ar="رسائل مليئة بالحب" sub="Leave a little piece of your heart for Chahd. Every word makes her day more special." subAr="اتركوا لها رسالة صغيرة من قلوبكم، فكل كلمة تجعل يومها أجمل." />
      <MessageForm onAdded={(e) => setItems((p) => [e, ...p])} />

      <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m, i) => (
          <MessageCard key={m.id} item={m} index={i % PAGE} open={open === m.id} onToggle={() => setOpen(open === m.id ? null : m.id)} />
        ))}
        {loading && Array.from({ length: items.length ? 3 : 6 }).map((_, i) => (
          <div key={`s${i}`} className="glass h-48 animate-pulse rounded-3xl" aria-hidden />
        ))}
      </div>

      {!loading && items.length === 0 && (
        <div className="mx-auto mt-6 max-w-md text-center">
          <Heart className="mx-auto h-14 w-14 animate-pulse fill-lavender/40 text-lavender" />
          {failed ? (
            <p className="mt-4 text-muted-foreground">We couldn't load the letters right now. Please refresh. 💜</p>
          ) : (
            <>
              <p className="mt-4 font-display text-xl italic text-foreground">Be the first to leave Chahd a little happiness 💜</p>
              <p lang="ar" dir="rtl" className="mt-2 text-lilac">كن أول من يهدي شهد رسالة مليئة بالسعادة 💜</p>
            </>
          )}
        </div>
      )}

      {more && !loading && (
        <div className="mt-10 text-center">
          <button onClick={() => load(items.length)} className="glass rounded-full px-6 py-3 font-medium text-foreground transition hover:shadow-glow">Load more letters · المزيد</button>
        </div>
      )}

      <div className="mt-14 text-center">
        <p className="font-display text-2xl italic text-foreground text-glow">With all our love, your girls. 💜</p>
        <p lang="ar" dir="rtl" className="mt-2 text-lg font-semibold text-lilac">نحبّوك بزاف يا شهد، وعقبال 100 سنة من السعادة.</p>
      </div>
    </section>
  );
}

export function FinalMessage() {
  return (
    <section className="relative overflow-hidden px-4 pb-28 pt-10">
      <FloatingParticles count={16} />
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.2 }} className="glass relative mx-auto max-w-3xl rounded-[2rem] p-8 text-center shadow-glow sm:p-14">
        <p className="font-display text-3xl italic text-foreground text-glow sm:text-4xl">To our beautiful Chahd,</p>
        <p className="mx-auto mt-6 max-w-xl leading-relaxed text-muted-foreground">May your life always be filled with laughter, beautiful memories, endless love, and happiness.</p>
        <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted-foreground">You deserve every beautiful thing this world has to offer.</p>
        <p className="mt-5 font-display text-2xl text-candle">We love you so much! 💜</p>
        <div className="mx-auto my-8 h-px w-24 bg-lavender/60" />
        <div lang="ar" dir="rtl" className="space-y-3">
          <p className="text-2xl font-bold text-foreground">إلى شهد الجميلة،</p>
          <p className="text-lg leading-loose text-muted-foreground">نتمنّاو لك حياة مليئة بالفرح والنجاح والحب، وربي يحققلك كل ما تتمنّاي.</p>
          <p className="text-2xl font-bold text-candle">نحبّوك بزاف! 💜</p>
        </div>
      </motion.div>
    </section>
  );
}
