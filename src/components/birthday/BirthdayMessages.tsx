import { motion } from "framer-motion";
import { useState } from "react";
import { messages } from "@/content/birthday";
import { FloatingParticles } from "./FloatingParticles";
import { MessageCard } from "./MessageCard";
import { SectionHeading } from "./SectionHeading";

export function BirthdayMessages() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-28">
      <FloatingParticles count={8} variant="petal" />
      <SectionHeading en="Letters From Your Girls 💌" ar="رسائل من قلبنا إلى قلبك" sub="Because some feelings deserve more than just a birthday wish." />
      <motion.div layout className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {messages.map((m, i) => (
          <MessageCard key={m.name + i} item={m} index={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
        ))}
      </motion.div>
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
