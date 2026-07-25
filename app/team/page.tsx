import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import TeamCard from "@/components/TeamCard";
import { getTeam } from "@/lib/get-data";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the certified beauticians, trainers, and staff of Natural Beauty Clinic & Academy.",
};

export default async function TeamPage() {
  const team = await getTeam();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        eyebrow="Our Team"
        title="The people behind every treatment."
        description="A small, certified team led by an assessor-trainer — every service is delivered or supervised to the same standard we teach in the academy."
        align="center"
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <TeamCard key={member.slug} member={member} />
        ))}
      </div>
    </div>
  );
}
