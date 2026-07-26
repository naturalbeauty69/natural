import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import BrandDivider from "@/components/BrandDivider";
import Timeline from "@/components/Timeline";
import { getTeam } from "@/lib/get-data";
import {
  companyProfile,
  companyStory,
  ownerStory,
  directorMessage,
  timeline,
} from "@/data/company";

export const metadata: Metadata = {
  title: "About Us",
  description: companyProfile.shortDescription,
};

export default async function AboutPage() {
  const team = await getTeam();
  const director = team.find((m) => m.slug === "archana-silwal-kadel");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <SectionHeading
        eyebrow={`Established ${companyProfile.established}`}
        title="Natural Beauty Clinic & Academy"
        description={companyProfile.shortDescription}
      />

      <BrandDivider />

      {/* COMPANY STORY */}
      <section className="mt-4">
        <p className="eyebrow text-gold-500">Our Story</p>
        <h2 className="mt-2 text-3xl md:text-4xl">{companyStory.heading}</h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-soft">
          {companyStory.content.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </section>

      <BrandDivider className="mt-14" />

      {/* OWNER STORY */}
      {director && (
        <section className="mt-4 grid gap-8 sm:grid-cols-[minmax(0,220px)_1fr]">
          <div className="relative aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-xl2 shadow-soft">
            <Image src={director.photo_url} alt={ownerStory.name} fill className="object-cover" sizes="220px" />
          </div>
          <div>
            <p className="eyebrow text-gold-500">Owner Story</p>
            <h2 className="mt-2 font-display text-2xl text-emerald-900">{ownerStory.name}</h2>
            <p className="eyebrow mt-1 text-emerald-500">{ownerStory.title}</p>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-ink-soft">
              {ownerStory.content.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <BrandDivider className="mt-14" />

      {/* DIRECTOR'S MESSAGE */}
      <section className="mt-4 rounded-xl2 bg-emerald-900 p-8 text-cream md:p-12">
        <p className="eyebrow text-gold-300">Message from the Director</p>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-cream/80">
          {directorMessage.content.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
        <p className="mt-6 font-display text-lg text-cream">{directorMessage.signOffName}</p>
        <p className="eyebrow text-gold-300">{directorMessage.signOffTitle}</p>
      </section>

      <BrandDivider className="mt-14" />

      {/* MISSION / VISION */}
      <section className="mt-4 grid gap-8 sm:grid-cols-2">
        <div className="card p-6">
          <p className="eyebrow text-gold-500">Mission</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{companyProfile.mission}</p>
        </div>
        <div className="card p-6">
          <p className="eyebrow text-gold-500">Vision</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{companyProfile.vision}</p>
        </div>
      </section>

      <BrandDivider className="mt-14" />

      {/* CORE VALUES */}
      <section className="mt-4">
        <p className="eyebrow text-center text-gold-500">Core Values</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {companyProfile.coreValues.map((value) => (
            <span
              key={value}
              className="rounded-full border border-emerald-700/20 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-900"
            >
              {value}
            </span>
          ))}
        </div>
      </section>

      <BrandDivider className="mt-14" />

      {/* WHY CHOOSE US */}
      <section className="mt-4">
        <h2 className="text-center text-3xl md:text-4xl">Why Choose Natural Beauty</h2>
        <ul className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
          {companyProfile.whyChooseUs.map((reason) => (
            <li key={reason} className="flex items-start gap-2 text-sm text-ink-soft">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-500" />
              {reason}
            </li>
          ))}
        </ul>
      </section>

      <BrandDivider className="mt-14" />

      {/* JOURNEY TIMELINE */}
      <section className="mt-4">
        <h2 className="text-center text-3xl md:text-4xl">Our Journey</h2>
        <div className="mx-auto mt-10 max-w-2xl">
          <Timeline entries={timeline} />
        </div>
      </section>
    </div>
  );
}
