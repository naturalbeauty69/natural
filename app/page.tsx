import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import BrandDivider from "@/components/BrandDivider";
import ServiceCard from "@/components/ServiceCard";
import StatsGrid from "@/components/StatsGrid";
import TestimonialCard from "@/components/TestimonialCard";
import { getServices, getTeam, getContactSettings, getTestimonials } from "@/lib/get-data";
import { homepageContent } from "@/data/homepage";

export default async function HomePage() {
  const [services, team, contact, testimonials] = await Promise.all([
    getServices(),
    getTeam(),
    getContactSettings(),
    getTestimonials(),
  ]);

  const featured = services.filter((s) => s.is_featured).slice(0, 3);
  const highlightServices = featured.length ? featured : services.slice(0, 3);
  const director = team.find((m) => m.slug === "archana-silwal-kadel");

  return (
    <>
      <Hero
        tagline="Professional Beauty, Skin & Hair Care | Training & Certification"
        heading={homepageContent.heroHeading}
        description={homepageContent.heroDescription}
        ctas={homepageContent.heroCtas}
      />

      <BrandDivider />

      {/* ABOUT SECTION */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl">{homepageContent.aboutHeading}</h2>
        <div className="mx-auto mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-ink-soft">
          {homepageContent.aboutContent.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </section>

      {/* STATISTICS */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <StatsGrid stats={homepageContent.statistics} />
      </section>

      <BrandDivider />

      {/* FEATURED SERVICES */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Featured Services"
            title="A glimpse of what's on the menu."
            description="Every price on this site is pulled live from our services database — nothing is hardcoded, so what you see is always current."
          />
          <Link href="/services" className="btn-outline">View Full Price List</Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {highlightServices.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </section>

      <BrandDivider />

      {/* DIRECTOR INTRO */}
      {director && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,320px)_1fr]">
            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl2 shadow-soft">
              <Image
                src={director.photo_url}
                alt={director.name}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
            <div>
              <p className="eyebrow">Meet the Director</p>
              <h2 className="mt-2 text-3xl md:text-4xl">{director.name}</h2>
              <p className="eyebrow mt-1 text-gold-500">{director.role}</p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
                {director.bio}
              </p>
              <Link href="/about" className="btn-primary mt-6 inline-flex">
                Read the Director's Message
              </Link>
            </div>
          </div>
        </section>
      )}

      <BrandDivider />

      {/* ACADEMY HIGHLIGHT */}
      <section className="bg-emerald-900 py-16 text-cream">
        <div className="mx-auto max-w-7xl px-6">
          <p className="eyebrow text-gold-300">Natural Beauty Academy</p>
          <h2 className="mt-2 max-w-xl text-3xl text-cream md:text-4xl">
            Get certified in professional beauty, hair science, and makeup artistry.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/70">
            Learn directly from an assessor-led curriculum, train on real clients within
            the clinic, and graduate with certification recognized across Nepal&apos;s
            salon and bridal industry.
          </p>
          <Link href="/academy" className="btn-gold mt-6 inline-flex">
            Explore Courses
          </Link>
        </div>
      </section>

      <BrandDivider />

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Testimonials" title="What clients & students say." />
          <Link href="/testimonials" className="btn-outline">Read All Reviews</Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading eyebrow="Visit or Reach Us" title="New Baneshwor, Kathmandu" align="center" />
        <p className="mt-3 text-center text-sm text-ink-soft">{contact.businessHours}</p>
        <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-4 text-sm">
          {contact.phones.map((p) => (
            <a key={p} href={`tel:${p}`} className="btn-outline">{p}</a>
          ))}
          <a
            href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
            className="btn-primary"
          >
            WhatsApp Us
          </a>
        </div>
      </section>
    </>
  );
}
