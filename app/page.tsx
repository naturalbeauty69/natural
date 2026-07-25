import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import BrandDivider from "@/components/BrandDivider";
import ServiceCard from "@/components/ServiceCard";
import TeamCard from "@/components/TeamCard";
import { getServices, getTeam, getContactSettings } from "@/lib/get-data";

export default async function HomePage() {
  const [services, team, contact] = await Promise.all([
    getServices(),
    getTeam(),
    getContactSettings(),
  ]);

  const featured = services.filter((s) => s.is_featured).slice(0, 3);
  const highlightServices = featured.length
    ? featured
    : services.slice(0, 3);

  const director = team.find((m) => m.slug === "archana-silwal-kadel");

  return (
    <>
      <Hero tagline="Professional Beauty, Skin & Hair Care | Training & Certification" />

      <BrandDivider />

      {/* WHY CHOOSE US */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Why Natural Beauty"
          title="A clinic run on training, not guesswork."
          description="Every treatment is performed or supervised by a certified assessor, using globally recognized product lines — LOTUS, CASMARA, and O3+ — inside a purpose-built, hygienic clinic in New Baneshwor."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { title: "Certified & Assessed", body: "Led by a senior beautician who is also a licensed trainer and assessor — not just a service provider." },
            { title: "Science-Backed Skincare", body: "Skin analysis and treatments built on internationally recognized brand protocols." },
            { title: "Train Where You're Treated", body: "The same clinic floor trains the next generation of beauticians — theory tested against real client results." },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <p className="font-display text-lg text-emerald-900">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>
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
              <Link href="/team" className="btn-primary mt-6 inline-flex">
                Meet the Full Team
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

      {/* CONTACT STRIP */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading eyebrow="Visit or Reach Us" title="New Baneshwor, Kathmandu" align="center" />
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
