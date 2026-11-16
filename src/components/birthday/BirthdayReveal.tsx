import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function BirthdayReveal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.4, delay: 1.6, ease: "easeOut" }}
      className="glass mx-auto w-full max-w-xl rounded-3xl p-6 text-center shadow-glow sm:p-8"
      role="status"
    >
      <h2 className="font-display text-3xl font-semibold text-foreground text-glow sm:text-5xl">Happy Birthday, Chahd! 💜</h2>
      <p lang="ar" dir="rtl" className="mt-3 text-xl font-bold text-lilac sm:text-2xl">كل عام وأنتِ بخير يا شهد.</p>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
        May every wish in your heart find its way to reality. You deserve all the happiness in the world.
      </p>
      <button
        onClick={() => document.getElementById("video")?.scrollIntoView({ behavior: "smooth" })}
        className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-royal-gradient px-7 py-3 font-medium text-primary-foreground shadow-glow transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Discover your surprise <ChevronDown className="h-4 w-4 animate-bounce" />
      </button>
    </motion.div>
  );
}
