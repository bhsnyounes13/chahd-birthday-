import { createFileRoute } from "@tanstack/react-router";
import { BirthdayHero } from "@/components/birthday/BirthdayHero";
import { BirthdayMessages, FinalMessage } from "@/components/birthday/BirthdayMessages";
import { GirlsVideo } from "@/components/birthday/GirlsVideo";
import { MusicPlayer } from "@/components/birthday/MusicPlayer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday, Chahd 💜 — اليوم يومك يا شهد" },
      { name: "description", content: "A magical birthday surprise for Chahd, made with love by her girls." },
      { property: "og:title", content: "Happy Birthday, Chahd 💜" },
      { property: "og:description", content: "Make a wish and blow the candle — a surprise made with love by your girls." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="overflow-x-hidden">
      <BirthdayHero />
      <GirlsVideo />
      <BirthdayMessages />
      <FinalMessage />
      <MusicPlayer />
    </main>
  );
}
