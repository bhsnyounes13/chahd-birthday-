import { ExternalLink, Music } from "lucide-react";
import { musicArtist, musicTitle, musicUrl } from "@/content/birthday";

export function MusicPlayer() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a
        href={musicUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Listen to ${musicTitle} by ${musicArtist} on YouTube Music`}
        className="glass flex items-center gap-3 rounded-full p-2 pr-4 text-foreground shadow-glow transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-royal-gradient text-primary-foreground">
          <Music className="h-5 w-5" />
        </span>
        <span className="text-left">
          <span className="block text-xs font-medium">
            {musicTitle} · {musicArtist}
          </span>
          <span className="block text-[10px] text-lilac">Listen on YouTube Music</span>
        </span>
        <ExternalLink aria-hidden="true" className="h-4 w-4 text-lilac" />
      </a>
    </div>
  );
}
