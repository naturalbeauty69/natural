export interface Offer {
  image: string;
  label: string;
}

const L = "/images/library";

// Promotional banner posters. Each image is the offer itself (poster
// design already contains the offer text) — labels here are just for
// accessible alt text, not additional overlaid copy.
export const offers: Offer[] = [
  { image: `${L}/botox-offer.webp`, label: "Hair Botox Treatment Offer" },
  { image: `${L}/facial-offer.webp`, label: "Facial Treatment Offer" },
  { image: `${L}/global-color-offer.webp`, label: "Global Hair Color Offer" },
  { image: `${L}/highlight-offer.webp`, label: "Hair Highlights Offer" },
  { image: `${L}/keratin-offer.webp`, label: "Keratin Treatment Offer" },
  { image: `${L}/nanoplastia-offer.webp`, label: "Nanoplastia Treatment Offer" },
];
