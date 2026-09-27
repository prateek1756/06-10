export const BIRTHDAY_CONFIG = {
  // ── Identity ──────────────────────────────────────────────────────────────
  recipientName: "Special One",
  senderName: "Yours Truly",

  // ── Secret Passcode ──────────────────────────────────────────────────────
  // The 4-digit code the visitor must enter to unlock the experience
  passcode: "0610",

  // ── Wrong-code hints (cycling) ───────────────────────────────────────────
  wrongCodeHints: [
    "Hmm... think harder 🤔",
    "Still wrong. Are you even trying?",
    "Come on, you know this one!",
    "Almost... (not really)",
    "Think about what day it is... 📅",
  ],

  // ── Playful Annoy Scene ──────────────────────────────────────────────────
  annoyHeadline: "I WANT TO ANNOY YOU",
  annoySub: "for the rest of your life",
  annoyNote: "Because nobody else gets the privilege of driving you crazy like I do. 🐻❤️",

  // ── Cake & Wishes ────────────────────────────────────────────────────────
  cakeTitle: "MAKE A WISH",
  cakeSub: "blow your candle ⤹",
  cakeQuotes: [
    "Your smile makes every space feel brighter and your laugh feels like pure magic ✨",
    "I pray that all your dreams and wishes come true this year 🤍",
  ],

  // ── Gifts (3 surprises to open) ──────────────────────────────────────────
  gifts: [
    {
      id: "gift-1",
      emoji: "🌟",
      label: "A Little Truth",
      color: "#c0392b",
      message: "You make ordinary days feel like something worth remembering forever.",
    },
    {
      id: "gift-2",
      emoji: "🎵",
      label: "Our Song",
      color: "#8e44ad",
      message: "Somewhere right now, a melody is playing that will forever belong to you and me.",
    },
    {
      id: "gift-3",
      emoji: "🎟️",
      label: "A Golden Ticket",
      color: "#d4af37",
      message: "Redeemable anytime: One wish granted, zero questions asked, whenever you want! ✨",
    },
  ],

  // ── Moments I Cherish With You (Polaroid Gallery) ────────────────────────
  moments: [
    {
      id: "mem-1",
      title: "The Warmest Glow",
      date: "Magical Evenings",
      caption: "You have a natural warmth that softens the world and turns any evening into pure magic.",
      photo: "/photos/photo1.jpg",
      emoji: "✨",
      rotation: -3,
    },
    {
      id: "mem-2",
      title: "Sweetest Comfort",
      date: "Quiet Joys",
      caption: "The way you smile while holding little innocent souls shows how wonderfully gentle your heart is.",
      photo: "/photos/photo2.jpg",
      emoji: "🐱",
      rotation: 2.5,
    },
    {
      id: "mem-3",
      title: "Midnight Unfiltered Laughs",
      date: "Under the City Lights",
      caption: "Those late-night stops, thoughtful glances, and talks where time completely forgot to move.",
      photo: "/photos/photo3.jpg",
      emoji: "🌙",
      rotation: -2,
    },
    {
      id: "mem-4",
      title: "Golden Hour Grace",
      date: "Sunset Whispers",
      caption: "Caught in the evening light—graceful, quiet, and effortlessly breathtaking in every way.",
      photo: "/photos/photo4.jpg",
      emoji: "🌅",
      rotation: 3,
    },
    {
      id: "mem-5",
      title: "Elegance & Radiance",
      date: "Special Celebrations",
      caption: "Stepping into another beautiful year with all the elegance, charm, and radiance you possess.",
      photo: "/photos/photo5.jpg",
      emoji: "💜",
      rotation: -1.5,
    },
  ],

  // ── Grand Finale Letter ──────────────────────────────────────────────────
  letter: {
    salutation: "To the love of my life...",
    intro: "To the person who has stolen my heart (and never returned it 🙈)",
    paragraphs: [
      "Happy birthday! There are simply not enough words in any language to tell you how deeply you are loved, and no amount of time is ever enough when I'm with you.",
      "You make my entire world feel softer. Safer. Real. You feel like coming home 🏡",
      "I will always believe the universe knew exactly what it was doing when our paths crossed. Someone kind, someone steady, someone who sees all of me and still chooses to hold my hand.",
      "Thank you for being my constant warmth and my favorite human.",
      "Today belongs entirely to you. Here's to making memories today, tomorrow, and every year ahead.",
    ],
    signOff: "With all my love, always & forever ❤️",
    author: "Yours Truly",
  },
} as const;
