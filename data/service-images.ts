// Maps real uploaded photos to services. Category images act as the
// default thumbnail for every service in that category; specific
// overrides take priority for services with their own dedicated photo.

export const categoryImages: Record<string, string> = {
  "skin-treatments": "/images/library/Skin-and-facial-treatment.webp",
  "threading": "/images/library/eyebrow-threading.webp",
  "waxing": "/images/library/body-waxing.webp",
  "hair-services": "/images/library/hair-styling-blowdry.webp",
  "hair-treatments": "/images/library/Hair-treatment.webp",
  "manicure-pedicure": "/images/library/Manicure-pedicure.webp",
  "makeup": "/images/library/Makeup-services.webp",
  "nail-services": "/images/library/Nail-services.webp",
};

export const serviceImageOverrides: Record<string, string> = {
  "bridal-makeup": "/images/library/nepali-bridal-makeup.webp",
  "day-makeup": "/images/library/Makeup.webp",
  "party-night-makeup": "/images/library/Party-makeup.webp",
  "hair-keratin": "/images/library/keratin-treatment.webp",
  "hair-botox": "/images/library/hair-botox.webp",
  "nanoplastia": "/images/library/nanoplastia.webp",
  "hair-cut": "/images/library/hair-cutting-scissor.webp",
  "hair-treatment-spa": "/images/library/hair-smoothening-rebonding.webp",
};

export function getServiceImage(categorySlug: string, serviceSlug: string): string | null {
  return serviceImageOverrides[serviceSlug] ?? categoryImages[categorySlug] ?? null;
}
