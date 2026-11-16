import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** Animated flame/smoke overlay, positioned in % of the hero image box over its painted candle. */
export function InteractiveCandle({ lit }: { lit: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute" style={{ left: "50%", top: "22.6%", width: 0, height: 0 }}>
      {/* covers the painted flame once blown out */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "5.5cqw", height: "16cqw", left: "-2.75cqw", top: "-15cqw",
          background: "radial-gradient(ellipse at center, oklch(0.58 0.17 305) 30%, oklch(0.55 0.17 305 / 0) 70%)",
          filter: "blur(6px)",
        }}
        animate={{ opacity: lit ? 0 : 1 }}
        transition={{ duration: 1.2, delay: lit ? 0 : 0.3 }}
      />
      {/* ambient glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "22cqw", height: "22cqw", left: "-11cqw", top: "-17cqw",
          background: "radial-gradient(circle, oklch(0.89 0.11 80 / 0.45), oklch(0.89 0.11 80 / 0) 60%)",
        }}
        animate={lit ? { opacity: reduce ? 0.8 : [0.65, 0.9, 0.7, 0.85] } : { opacity: 0 }}
        transition={lit ? { duration: 2.4, repeat: Infinity } : { duration: 1.5 }}
      />
      <AnimatePresence>
        {lit && (
          <motion.div
            key="flame"
            className="absolute"
            style={{ left: "-1.3cqw", top: "-8.2cqw", width: "2.6cqw", height: "8cqw", transformOrigin: "50% 100%" }}
            exit={{ scaleY: 0.1, scaleX: 0.4, opacity: 0, transition: { duration: 0.9, ease: "easeIn" } }}
          >
            <motion.div
              className="h-full w-full"
              style={{ transformOrigin: "50% 100%" }}
              animate={reduce ? {} : { scaleY: [1, 1.08, 0.95, 1.05, 1], scaleX: [1, 0.94, 1.04, 0.97, 1], rotate: [0, 1.5, -1.5, 1, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  borderRadius: "50% 50% 50% 50% / 65% 65% 35% 35%",
                  background: "radial-gradient(ellipse at 50% 78%, oklch(1 0 0) 0%, oklch(0.95 0.1 90) 25%, oklch(0.82 0.16 65) 55%, oklch(0.65 0.2 40 / 0.6) 80%, transparent 100%)",
                  filter: "blur(1px)",
                  boxShadow: "0 0 2cqw oklch(0.89 0.11 80 / 0.9), 0 0 5cqw oklch(0.8 0.15 60 / 0.5)",
                }}
              />
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ bottom: "6%", width: "40%", height: "30%", borderRadius: "50%", background: "radial-gradient(oklch(0.55 0.15 280 / 0.8), transparent 70%)" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* smoke */}
      {!lit && !reduce &&
        [0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-lilac/50"
            style={{ width: "1.6cqw", height: "1.6cqw", left: "-0.8cqw", top: "-1.6cqw", filter: "blur(6px)" }}
            initial={{ y: 0, x: 0, opacity: 0, scale: 0.4 }}
            animate={{ y: "-22cqw", x: ([0, 12, -16, 10, -6][i] ?? 0) * 3, opacity: [0, 0.8, 0], scale: 4 }}
            transition={{ duration: 4.5, delay: 0.7 + i * 0.45, ease: "easeOut" }}
          />
        ))}
      {/* golden burst */}
      {!lit &&
        Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return (
            <motion.span
              key={i}
              className="absolute block rounded-full bg-candle shadow-candle"
              style={{ width: 5, height: 5, left: -2, top: "-4cqw" }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: Math.cos(a) * 140, y: Math.sin(a) * 140, opacity: 0, scale: 0.3 }}
              transition={{ duration: 1.8, delay: 0.6, ease: "easeOut" }}
            />
          );
        })}
    </div>
  );
}
