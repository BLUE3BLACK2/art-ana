// Harga, ukuran cetak, dan stok adalah data contoh untuk prototype kuliah.
// Gambar adaptasi tidak diatribusikan sebagai karya asli seniman inspirasinya.
import { printSizes } from "./printoptions.js";
export { printSizes } from "./printoptions.js";

const image = (filename) =>
  `${import.meta.env?.BASE_URL ?? "/"}images/paintings/${filename}.png`;

export const paintings = [
  {
    id: 1,
    title: "Muscle Lisa",
    artist: "Adaptation of Leonardo da Vinci",
    origin: "International",
    era: "Contemporary",
    subject: "People / Portraits",
    filename: "muscle-lisa",
    price: 250000000,
    stock: 8,
    description:
      "A familiar portrait with a muscular twist and a sense of humor. A playful interpretation that brings character to your walls.",
    attribution:
      "A parody of Mona Lisa by Leonardo da Vinci. The creator of this adaptation is unknown.",
  },
  {
    id: 2,
    title: "The Horse Fair",
    artist: "Rosa Bonheur",
    origin: "International",
    era: "Classic",
    subject: "Animals",
    filename: "the-horse-fair",
    price: 320000000,
    stock: 6,
    description:
      "Moving horses and a bustling market come together in a dramatic composition. For animal lovers and anyone drawn to scenes full of energy.",
  },
  {
    id: 3,
    title: "Penangkapan Pangeran Diponegoro",
    artist: "Raden Saleh",
    origin: "Indonesia",
    era: "Classic",
    subject: "People / Portraits",
    filename: "penangkapan-pangeran-diponegoro",
    price: 350000000,
    stock: 5,
    description:
      "A historic scene filled with figures and expressions. A piece that invites conversations about history.",
  },
  {
    id: 4,
    title: "Javanese Landscape with Tigers",
    artist: "Raden Saleh",
    origin: "Indonesia",
    era: "Classic",
    subject: "Animals",
    filename: "javanese-landscape-with-tigers",
    price: 300000000,
    stock: 7,
    description:
      "Tigers, trees, and warm light create a dramatic natural scene. Its subtle details invite a closer look.",
  },
  {
    id: 5,
    title: "The Scary Night",
    artist: "Adaptation of Vincent van Gogh",
    origin: "International",
    era: "Contemporary",
    subject: "Landscape",
    filename: "the-scary-night",
    price: 275000000,
    stock: 9,
    description:
      "A swirling night sky meets Batman. An expressive landscape with a pop-culture twist for your favorite corner.",
    attribution:
      "A parody of The Starry Night by Vincent van Gogh. The creator of this adaptation is unknown.",
  },
  {
    id: 6,
    title: "Sunflowers",
    artist: "Adaptation of Vincent van Gogh",
    origin: "International",
    era: "Contemporary",
    subject: "Still life",
    filename: "sunflowers",
    price: 240000000,
    stock: 8,
    description:
      "Sunflowers in vibrant yellow with an unexpected visual twist. Warm energy that speaks for itself.",
    attribution:
      "A modified version of Sunflowers by Vincent van Gogh. The creator of this adaptation is unknown.",
  },
  {
    id: 7,
    title: "Composition 8",
    artist: "Wassily Kandinsky",
    origin: "International",
    era: "Modern",
    subject: "Abstract",
    filename: "composition-8",
    price: 290000000,
    stock: 6,
    description:
      "Circles, lines, and planes of color create a visual rhythm. Abstract art that tells a different story with every viewing.",
  },
  {
    id: 8,
    title: "Ibuku",
    artist: "Affandi",
    origin: "Indonesia",
    era: "Modern",
    subject: "People / Portraits",
    filename: "ibuku",
    price: 280000000,
    stock: 4,
    description:
      "An intimate portrait with a quiet expression. A piece that places a human story at its heart.",
  },
  {
    id: 9,
    title: "Pengantin Revolusi",
    artist: "Hendra Gunawan",
    origin: "Indonesia",
    era: "Modern",
    subject: "People / Portraits",
    filename: "pengantin-revolusi",
    price: 330000000,
    stock: 5,
    description:
      "Expressive figures and vibrant colors fill a lively scene. A narrative piece that brings social life into your space.",
  },
  {
    id: 10,
    title: "The Man from Bantul",
    artist: "Nyoman Masriadi",
    origin: "Indonesia",
    era: "Contemporary",
    subject: "People / Portraits",
    filename: "the-man-from-bantul",
    price: 380000000,
    stock: 3,
    description:
      "Powerful boxers and a lively audience form a composition full of character. For spaces that call for a bold visual statement.",
  },
  {
    id: 11,
    title: "Infinity Nets",
    artist: "Yayoi Kusama (series reference)",
    origin: "International",
    era: "Contemporary",
    subject: "Abstract",
    filename: "infinity-nets",
    price: 310000000,
    stock: 5,
    description:
      "Repeating networks and intense colors fill the surface. An abstract rhythm that draws attention from near and far.",
    attribution:
      "The catalog title refers to the Infinity Nets series. The specific work shown has not been verified.",
  },
  {
    id: 12,
    title: "Girl with a Ice Cream",
    artist: "Adaptation of Johannes Vermeer",
    origin: "International",
    era: "Contemporary",
    subject: "People / Portraits",
    filename: "girl-with-a-ice-cream",
    price: 260000000,
    stock: 7,
    description:
      "Sunglasses, ice cream, and an iconic portrait in one image. A playful adaptation for art lovers with a sense of humor.",
    attribution:
      "A parody of Girl with a Pearl Earring by Johannes Vermeer. The creator of this adaptation is unknown.",
  },
  {
    id: 13,
    title: "The Persistence of Cat Memory",
    artist: "Adaptation of Salvador Dalí",
    origin: "International",
    era: "Contemporary",
    subject: "Still life",
    filename: "the-persistence-of-cat-memory",
    price: 285000000,
    stock: 8,
    description:
      "Melting clocks and lounging cats create a delightfully surreal world. Time seems to follow a rhythm of its own.",
    attribution:
      "A parody of The Persistence of Memory by Salvador Dalí. The creator of this adaptation is unknown.",
  },
  {
    id: 14,
    title: "Ermine with an Lady",
    artist: "Adaptation of Leonardo da Vinci",
    origin: "International",
    era: "Contemporary",
    subject: "Animals",
    filename: "ermine-with-an-lady",
    price: 270000000,
    stock: 6,
    description:
      "Human and ermine swap roles in a surprising portrait. An absurd twist for a collection that does not take itself too seriously.",
    attribution:
      "A parody of Lady with an Ermine by Leonardo da Vinci. The creator of this adaptation is unknown.",
  },
  {
    id: 15,
    title: "The Great Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    origin: "International",
    era: "Classic",
    subject: "Landscape",
    filename: "the-great-wave-off-kanagawa",
    price: 295000000,
    stock: 10,
    description:
      "A towering wave, boats, and a distant mountain form an iconic Japanese landscape. Its lines and blues bring rhythm to a room.",
    attribution:
      "The reference work is a woodblock print (ukiyo-e), not a canvas painting.",
  },
  {
    id: 16,
    title: "Your Nightmare",
    artist: "Rubby Artana",
    origin: "Indonesia",
    era: "Contemporary",
    subject: "People / Portraits",
    filename: "your-nightmare-rubby-artana",
    price: 450000000,
    stock: 4,
    description:
      "Batman emerges among reds, blues, and bold textures. A personal work by Rubby Artana with a dark, intense character.",
    attribution:
      "A personal work by Rubby Artana. This prototype offers a print, not the original canvas.",
  },
].map((painting) => ({
  ...painting,
  image: image(painting.filename),
  sizes: printSizes.map((size) => size.value),
}));

export const featuredPaintings = [1, 5, 7, 13].map((id) =>
  paintings.find((painting) => painting.id === id),
);
