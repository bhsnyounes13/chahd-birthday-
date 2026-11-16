import { AnimatePresence, motion } from "framer-motion";
import { Music, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { musicSrc } from "@/content/birthday";

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => {
    if (audio.current) { audio.current.pause(); audio.current.src = ""; audio.current = null; }
  }, []);
  useEffect(() => { if (audio.current) audio.current.volume = volume; }, [volume]);

  const toggle = () => {
    setOpen(true);
    setError(null);
    if (playing) { audio.current?.pause(); setPlaying(false); return; }
    if (!audio.current) {
      const a = new Audio(musicSrc);
      a.loop = true;
      a.preload = "auto";
      a.addEventListener("error", () => { setPlaying(false); setError("The song isn't available yet 🎶"); });
      a.addEventListener("pause", () => setPlaying(false));
      a.addEventListener("play", () => setPlaying(true));
      audio.current = a;
    }
    audio.current.volume = volume;
    audio.current.play().catch(() => { setPlaying(false); setError("Tap again to play the music 🎶"); });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" className="glass rounded-full px-4 py-2 text-xs text-foreground">{error}</motion.p>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-2">
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass flex h-12 items-center gap-3 rounded-full px-4">
              <span className="hidden text-xs text-lilac sm:inline">Snowman · Sia</span>
              <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => setVolume(+e.target.value)} aria-label="Music volume" className="w-20 accent-lavender sm:w-28" />
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={toggle} aria-label={playing ? "Pause music" : "Play music"} className="relative grid h-14 w-14 place-items-center rounded-full bg-royal-gradient text-primary-foreground shadow-glow transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {playing && <span className="absolute inset-0 animate-ping rounded-full bg-lavender/30 motion-reduce:hidden" />}
          {playing ? <Pause className="h-5 w-5" /> : open ? <Play className="h-5 w-5" /> : <Music className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
