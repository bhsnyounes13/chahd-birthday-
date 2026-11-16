import { motion } from "framer-motion";
import { Heart, Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import { videoPoster, videoSrc } from "@/content/birthday";
import { FloatingParticles } from "./FloatingParticles";
import { SectionHeading } from "./SectionHeading";

export function GirlsVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };
  const setVol = (n: number) => {
    setVolume(n);
    if (ref.current) { ref.current.volume = n; ref.current.muted = n === 0; }
    setMuted(n === 0);
  };
  const toggleMute = () => {
    const m = !muted;
    setMuted(m);
    if (ref.current) ref.current.muted = m;
  };
  const fullscreen = () => {
    const el = frame.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null;
    const v = ref.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (document.fullscreenElement) { void document.exitFullscreen(); return; }
    if (el?.requestFullscreen) el.requestFullscreen();
    else v?.webkitEnterFullscreen?.();
  };

  return (
    <section id="video" className="relative overflow-hidden px-4 py-20 sm:py-28">
      <FloatingParticles count={10} variant="petal" />
      <SectionHeading
        en="Memories Made With Love"
        ar="لحظات جمعتنا، وذكريات لن ننساها"
        sub="Every smile, every laugh, and every little moment tells a story of friendship."
        subAr="كل ضحكة، كل لحظة، وكل ذكرى تحمل جزءاً من صداقتنا."
      />
      <motion.div
        ref={frame}
        initial={{ opacity: 0, scale: 0.94, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
        className="relative mx-auto mt-12 aspect-video w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-lavender/70 bg-violet shadow-glow"
      >
        {videoSrc ? (
          <>
            <video
              ref={ref}
              src={videoSrc}
              poster={videoPoster || undefined}
              playsInline
              className="h-full w-full object-contain"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onClick={toggle}
            />
            {!playing && (
              <button onClick={toggle} aria-label="Play video" className="absolute inset-0 m-auto grid h-20 w-20 place-items-center rounded-full bg-royal-gradient text-primary-foreground shadow-glow transition hover:scale-110">
                <Play className="ml-1 h-9 w-9" fill="currentColor" />
              </button>
            )}
            <div className="glass absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-full px-4 py-2">
              <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="grid h-10 w-10 place-items-center text-foreground">
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="grid h-10 w-10 place-items-center text-foreground">
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume} onChange={(e) => setVol(+e.target.value)} aria-label="Volume" className="w-24 accent-lavender" />
              <button onClick={fullscreen} aria-label="Full screen" className="ml-auto grid h-10 w-10 place-items-center text-foreground">
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-royal-gradient p-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-lilac/70 sm:h-20 sm:w-20">
              <Heart className="h-7 w-7 text-lilac" />
            </div>
            <p className="font-display text-xl text-foreground sm:text-2xl">Our video is on its way…</p>
            <p lang="ar" dir="rtl" className="text-sm text-lilac">الفيديو قادم قريباً 💜</p>
          </div>
        )}
      </motion.div>
      <p className="mt-6 text-center font-display text-base italic text-lilac">Made with love, just for you, Chahd. 💜</p>
    </section>
  );
}
