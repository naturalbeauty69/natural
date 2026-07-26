import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import BrandDivider from "@/components/BrandDivider";
import ServiceCard from "@/components/ServiceCard";
import { getServiceCategories, getServices } from "@/lib/get-data";
import { categoryImages, serviceImageOverrides } from "@/data/service-images";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description: "Full price list for skin, hair, waxing, threading, makeup, and nail services at Natural Beauty Clinic.",
};

export default async function ServicesPage() {
  const [categories, services] = await Promise.all([
    getServiceCategories(),
    getServices(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        eyebrow="Services & Pricing"
        title="Our official price list."
        description="Every price below is loaded from our services database, kept current by our admin team. Ranges reflect variation by hair length, product, or complexity — ask our front desk or WhatsApp us for an exact quote."
        align="center"
      />

      <div className="mt-14 space-y-16">
        {categories.map((category) => {
          const categoryServices = services
            .filter((s) => s.category_slug === category.slug)
            .map((s) => ({ ...s, image_url: s.image_url ?? serviceImageOverrides[s.slug] ?? null }));
          if (!categoryServices.length) return null;

          const bannerImage = categoryImages[category.slug];

          return (
            <section key={category.slug} id={category.slug}>
              <div className="flex items-center gap-5">
                {bannerImage && (
                  <div className="relative hidden h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl2 shadow-soft sm:block">
                    <Image src={bannerImage} alt={category.name} fill className="object-cover" sizes="112px" />
                  </div>
                )}
                <div className="flex flex-1 items-center gap-4">
                  <h2 className="text-2xl md:text-3xl">{category.name}</h2>
                  <span className="h-px flex-1 bg-emerald-900/10" />
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {categoryServices.map((service) => (
                  <ServiceCard key={service.slug} service={service} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <BrandDivider className="mt-16" />

      <div className="mt-6 text-center">
        <p className="text-sm text-ink-soft">
          Bridal and package pricing may vary by consultation. Prices are subject to
          seasonal offers — current promotions are always reflected above automatically.
        </p>
      </div>
    </div>
  );
}
