import { motion } from "framer-motion";

export function SectionHeading({ en, ar, sub, subAr }: { en: string; ar: string; sub: string; subAr?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.9 }} className="mx-auto max-w-2xl text-center">
      <h2 className="font-display text-3xl font-semibold text-foreground text-glow sm:text-5xl">{en}</h2>
      <p lang="ar" dir="rtl" className="mt-3 text-xl font-bold text-lavender sm:text-2xl">{ar}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{sub}</p>
      {subAr && <p lang="ar" dir="rtl" className="mt-1 text-sm text-muted-foreground sm:text-base">{subAr}</p>}
    </motion.div>
  );
}
