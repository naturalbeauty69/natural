"use client";

import { useState } from "react";
import Image from "next/image";
import { TeamMember } from "@/lib/types";

export default function TeamCard({ member }: { member: TeamMember }) {
  const [expanded, setExpanded] = useState(false);
  const hasGallery = member.gallery && member.gallery.length > 0;

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

        {hasGallery && (
          <>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-4 text-xs font-medium text-emerald-700 hover:text-gold-600"
            >
              {expanded ? "Hide work photos" : `View work photos (${member.gallery!.length})`}
            </button>

            {expanded && (
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {member.gallery!.map((src) => (
                  <div key={src} className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={src}
                      alt={`${member.name} — work photo`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
