import Image from "next/image";
import { TeamMember } from "@/lib/types";

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={member.photo_url}
          alt={`${member.name}, ${member.role} at Natural Beauty Clinic & Academy`}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      </div>
      <div className="p-5">
        <p className="font-display text-lg text-emerald-900">{member.name}</p>
        <p className="eyebrow mt-1 text-gold-500">{member.role}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{member.bio}</p>
      </div>
    </div>
  );
}
