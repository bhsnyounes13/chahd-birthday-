import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

type Props = { count?: number; variant?: "sparkle" | "petal" | "butterfly"; className?: string };

export function FloatingParticles({ count = 18, variant = "sparkle", className = "" }: Props) {
  const reduce = useReducedMotion();
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: (i * 53.7) % 100,
        delay: (i * 1.37) % 8,
        duration: 9 + ((i * 2.3) % 8),
        size: variant === "sparkle" ? 2 + (i % 4) : 10 + (i % 3) * 5,
        drift: ((i % 5) - 2) * 30,
      })),
    [count, variant],
  );
  if (reduce) return null;
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {items.map((p) => (
        <motion.span
          key={p.id}
          className="absolute"
          style={{ left: `${p.left}%`, bottom: "-5%" }}
          initial={{ y: 0, x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: "-115vh",
            x: [0, p.drift, -p.drift / 2, p.drift],
            opacity: [0, 1, 1, 0],
            rotate: variant === "sparkle" ? 0 : 360,
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          {variant === "sparkle" && (
            <span
              className="block rounded-full bg-candle shadow-candle"
              style={{ width: p.size, height: p.size }}
            />
          )}
          {variant === "petal" && (
            <span
              className="block bg-lavender/70"
              style={{ width: p.size, height: p.size * 0.6, borderRadius: "80% 0 80% 0" }}
            />
          )}
          {variant === "butterfly" && (
            <motion.span
              className="block text-lilac/80"
              style={{ fontSize: p.size + 4 }}
              animate={{ scaleX: [1, 0.3, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              🦋
            </motion.span>
          )}
        </motion.span>
      ))}
    </div>
  );
}
