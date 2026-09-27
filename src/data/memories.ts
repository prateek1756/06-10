export interface MemoryItem {
  id: string;
  date: string;
  title: string;
  tag: string;
  description: string;
  /** Image URL or null to display the handcrafted polaroid placeholder */
  image: string | null;
  placeholderText: string;
  audioNote?: string;
  // Spatial coordinates for 3D corridor
  x: number;
  y: number;
  z: number;
  rotationY: number;
}

export const MEMORIES_DATA: MemoryItem[] = [
  {
    id: "mem-01",
    date: "Magical Evenings",
    title: "The Warmest Glow",
    tag: "Magic",
    description: "You have a natural warmth that softens the world and turns any evening into pure magic.",
    image: "/photos/photo1.jpg",
    placeholderText: "Holding fairy lights, surrounded by warm bokeh and magic.",
    x: -2.8,
    y: 0.6,
    z: -3.5,
    rotationY: 0.18
  },
  {
    id: "mem-02",
    date: "Quiet Joys",
    title: "Sweetest Comfort",
    tag: "Heart",
    description: "The way you smile while holding little innocent souls shows how wonderfully gentle your heart is.",
    image: "/photos/photo2.jpg",
    placeholderText: "Gentle smiles and sweet little comforts.",
    x: 2.7,
    y: -0.2,
    z: -6.5,
    rotationY: -0.22
  },
  {
    id: "mem-03",
    date: "Under the City Lights",
    title: "Midnight Unfiltered Laughs",
    tag: "Adventures",
    description: "Those late-night stops, thoughtful glances, and talks where time completely forgot to move.",
    image: "/photos/photo3.jpg",
    placeholderText: "Late night stops, warm conversations, unforgettable moments.",
    x: -2.6,
    y: -0.5,
    z: -9.8,
    rotationY: 0.15
  },
  {
    id: "mem-04",
    date: "Sunset Whispers",
    title: "Golden Hour Grace",
    tag: "Grace",
    description: "Caught in the evening light—graceful, quiet, and effortlessly breathtaking in every way.",
    image: "/photos/photo4.jpg",
    placeholderText: "Rimmed in golden light, quiet poise and elegance.",
    x: 2.9,
    y: 0.8,
    z: -13.0,
    rotationY: -0.19
  },
  {
    id: "mem-05",
    date: "Special Celebrations",
    title: "Elegance & Radiance",
    tag: "Celebration",
    description: "Stepping into another beautiful year with all the elegance, charm, and radiance you possess.",
    image: "/photos/photo5.jpg",
    placeholderText: "Poised in lilac, stepping forward with radiance and strength.",
    x: 0,
    y: 0.2,
    z: -16.5,
    rotationY: 0
  }
];
