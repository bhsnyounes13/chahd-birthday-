/**
 * Everything personal lives here — edit this file only.
 * - videoSrc: an MP4 path/URL (e.g. "/videos/girls.mp4" placed in /public, or a direct https .mp4 link). Leave "" to show the "coming soon" frame.
 * - musicSrc: an MP3 path/URL. Leave "" to use the built-in soft music-box melody.
 * - messages: add, remove or edit cards freely.
 */
export const videoSrc = "";
export const videoPoster = "";
export const musicSrc = "";

export type GirlMessage = { name: string; message: string; emoji?: string };

export const messages: GirlMessage[] = [
  {
    name: "Friend One",
    emoji: "🌸",
    message:
      "Write your birthday message for Chahd here. Share a wish, a feeling, or a reason she means so much to you. This card expands to show the full text, so it can be as long as your heart needs.",
  },
  {
    name: "Friend Two",
    emoji: "💜",
    message:
      "Replace this sample with your own words. Tell Chahd what you wish for her this year and how grateful you are to have her in your life.",
  },
  {
    name: "Friend Three",
    emoji: "🦋",
    message:
      "Your personal message goes here. You can write in English or Arabic — Arabic text displays right-to-left automatically.",
  },
  {
    name: "Friend Four",
    emoji: "✨",
    message:
      "A space for your sweetest birthday wish. Keep it short and sweet, or write a whole letter — both look beautiful.",
  },
  {
    name: "Friend Five",
    emoji: "🌷",
    message:
      "كل عام وأنتِ بخير يا شهد — اكتبي رسالتك هنا بدل هذا النص.",
  },
];
