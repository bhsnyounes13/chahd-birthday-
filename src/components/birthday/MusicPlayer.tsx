import { AnimatePresence, motion } from "framer-motion";
import { Music, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { musicSrc } from "@/content/birthday";

/** Gentle music-box melody synthesized live, used when no audio file is set. */
function createMusicBox() {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.connect(ctx.destination);
  const notes = [523.25, 659.25, 783.99, 987.77, 880, 783.99, 659.25, 587.33, 523.25, 659.25, 783.99, 1046.5, 987.77, 783.99, 698.46, 659.25];
  let step = 0;
  const play = () => {
    const t = ctx.currentTime;
    const f = notes[step % notes.length] ?? 523.25;
    for (const [freq, g] of [[f, 0.18], [f / 2, 0.06]] as const) {
      const o = ctx.createOscillator();
      const gain = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(g, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
      o.connect(gain).connect(master);
      o.start(t);
      o.stop(t + 2.3);
    }
    step++;
  };
  const id = setInterval(play, 520);
  play();
  return {
    setVolume: (v: number) => (master.gain.value = v),
    stop: () => { clearInterval(id); ctx.close().catch(() => {}); },
  };
}

export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [open, setOpen] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const box = useRef<ReturnType<typeof createMusicBox> | null>(null);

  useEffect(() => () => { box.current?.stop(); audio.current?.pause(); }, []);
  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
    box.current?.setVolume(volume);
  }, [volume]);

  const toggle = () => {
    setOpen(true);
    if (playing) {
      audio.current?.pause();
      box.current?.stop();
      box.current = null;
      setPlaying(false);
      return;
    }
    if (musicSrc) {
      if (!audio.current) { audio.current = new Audio(musicSrc); audio.current.loop = true; }
      audio.current.volume = volume;
      audio.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      box.current = createMusicBox();
      box.current.setVolume(volume);
      setPlaying(true);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass flex h-12 items-center rounded-full px-4">
            <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => setVolume(+e.target.value)} aria-label="Music volume" className="w-20 accent-lavender sm:w-28" />
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={toggle} aria-label={playing ? "Pause music" : "Play music"} className="relative grid h-14 w-14 place-items-center rounded-full bg-royal-gradient text-primary-foreground shadow-glow transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {playing && <span className="absolute inset-0 animate-ping rounded-full bg-lavender/30" />}
        {playing ? <Pause className="h-5 w-5" /> : open ? <Play className="h-5 w-5" /> : <Music className="h-5 w-5" />}
      </button>
    </div>
  );
}
