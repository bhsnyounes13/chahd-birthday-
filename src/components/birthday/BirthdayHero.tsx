import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, Wind } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import sceneUrl from "@/assets/chahd-birthday-scene.png?url";
import { BirthdayReveal } from "./BirthdayReveal";
import { Confetti } from "./Confetti";
import { FloatingParticles } from "./FloatingParticles";
import { InteractiveCandle } from "./InteractiveCandle";

export function BirthdayHero() {
  const [lit, setLit] = useState(true);
  const [mic, setMic] = useState<"off" | "listening" | "denied">("off");
  const stopRef = useRef<() => void>(() => {});

  const blow = useCallback(() => {
    setLit(false);
    stopRef.current();
  }, []);

  useEffect(() => () => stopRef.current(), []);

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      let loud = 0;
      let raf = 0;
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) sum += ((v - 128) / 128) ** 2;
        const rms = Math.sqrt(sum / data.length);
        loud = rms > 0.18 ? loud + 1 : Math.max(0, loud - 1);
        if (loud > 8) return blow();
        raf = requestAnimationFrame(tick);
      };
      stopRef.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((t) => t.stop());
        ctx.close().catch(() => {});
        setMic("off");
      };
      setMic("listening");
      tick();
    } catch {
      setMic("denied");
    }
  };

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden" aria-label="Birthday candle">
      {/* image box keeps the photo's proportions so the flame overlay stays on the painted candle */}
      <div
        className="absolute left-1/2 top-[14svh] aspect-[1672/941] h-[86svh] -translate-x-1/2 md:top-1/2 md:h-auto md:w-[max(100vw,calc(100svh*1672/941))] md:-translate-y-1/2"
        style={{ containerType: "size" }}
      >
        <motion.img
          src={sceneUrl}
          alt="Purple lilies, a birthday cake with a glowing candle, a gift box and butterflies"
          className="absolute inset-0 h-full w-full"
          animate={{ filter: lit ? "brightness(1)" : "brightness(1.12) saturate(1.15)" }}
          transition={{ duration: 2 }}
        />
        <InteractiveCandle lit={lit} />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[30svh] bg-gradient-to-b from-violet via-violet/70 to-transparent md:h-48 md:from-violet/80 md:via-violet/30" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-violet/95 via-violet/40 to-transparent" />
      <FloatingParticles count={22} />
      <FloatingParticles count={4} variant="butterfly" />
      {!lit && <Confetti />}

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-10 px-5 pt-6 text-center sm:pt-10"
      >
        <p className="font-display text-lg italic text-lilac text-glow sm:text-2xl">A special day for someone special...</p>
        <h1 lang="ar" dir="rtl" className="mt-1 text-3xl font-extrabold text-foreground text-glow sm:text-5xl">اليوم يومك يا شهد 💜</h1>
        <p className="mt-1 text-xs tracking-wide text-muted-foreground sm:text-sm">Something beautiful is waiting for you.</p>
      </motion.header>

      <div className="min-h-[34svh] flex-1" />

      <div className="relative z-10 px-4 pb-8 sm:pb-12">
        <AnimatePresence mode="wait">
          {lit ? (
            <motion.div
              key="wish"
              exit={{ opacity: 0, y: 20, transition: { duration: 0.6 } }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="glass mx-auto max-w-lg rounded-3xl p-5 text-center shadow-glow sm:p-6"
            >
              <p className="font-display text-lg text-foreground sm:text-xl">Close your eyes, make a wish, and blow the candle.</p>
              <p lang="ar" dir="rtl" className="mt-1 text-base font-semibold text-lilac">أغمضي عينيك، تمني أمنية، وأطفئي الشمعة.</p>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={blow}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-royal-gradient px-7 py-3 font-medium text-primary-foreground shadow-glow transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
                >
                  <Wind className="h-5 w-5" /> Blow the candle
                </button>
                {mic === "listening" ? (
                  <button onClick={() => stopRef.current()} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-candle/60 px-5 py-3 text-sm text-candle" aria-live="polite">
                    <Mic className="h-4 w-4 animate-pulse" /> Listening… blow now!
                  </button>
                ) : (
                  <button onClick={startMic} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-lilac/50 px-5 py-3 text-sm text-lilac transition hover:bg-lilac/10">
                    {mic === "denied" ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {mic === "denied" ? "Mic unavailable — use the button" : "Use microphone"}
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <BirthdayReveal key="reveal" />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
