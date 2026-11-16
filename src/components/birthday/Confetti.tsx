import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const colors = ["bg-royal", "bg-lavender", "bg-lilac", "bg-candle", "bg-violet"];

export function Confetti() {
  const reduce = useReducedMotion();
  const pieces = useMemo(
    () => Array.from({ length: 60 }, (_, i) => ({ i, left: Math.random() * 100, delay: Math.random() * 0.8, dur: 3 + Math.random() * 2.5, rot: Math.random() * 720, w: 6 + Math.random() * 6 })),
    [],
  );
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.i}
          className={`absolute top-0 block rounded-sm ${colors[p.i % colors.length]}`}
          style={{ left: `${p.left}%`, width: p.w, height: p.w * 0.45 }}
          initial={{ y: -30, opacity: 1, rotate: 0 }}
          animate={{ y: "105vh", rotate: p.rot, x: [0, 30, -30, 15], opacity: [1, 1, 0.9, 0] }}
          transition={{ duration: p.dur, delay: 0.9 + p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
