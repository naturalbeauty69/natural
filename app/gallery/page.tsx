import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { getGalleryImages } from "@/lib/get-data";
import { galleryCategories } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Natural Beauty Clinic & Academy — clinic, treatments, training, and student work.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        eyebrow="Gallery"
        title="Inside the clinic and academy."
        description="Real photos from our clinic, treatments, and training sessions — organized by category."
        align="center"
      />

      <div className="mt-12 space-y-14">
        {galleryCategories.map((category) => {
          const categoryImages = images.filter((img) => img.category === category.slug);
          return (
            <section key={category.slug}>
              <div className="flex items-center gap-4">
                <h2 className="text-xl md:text-2xl">{category.label}</h2>
                <span className="h-px flex-1 bg-emerald-900/10" />
              </div>

              {categoryImages.length ? (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {categoryImages.map((img) => (
                    <div key={img.url} className="relative aspect-square overflow-hidden rounded-xl2 shadow-soft">
                      <Image
                        src={img.url}
                        alt={img.caption || `${category.label} — Natural Beauty Clinic & Academy`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 25vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-ink-soft">
                  Photos coming soon — this category is ready to display real{" "}
                  {category.label.toLowerCase()} photos as soon as they&apos;re uploaded.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
