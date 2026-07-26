import Image from "next/image";
import { Service } from "@/lib/types";
import PriceTag from "@/components/PriceTag";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="card group flex items-center gap-4 overflow-hidden p-2 pr-5 transition-shadow hover:shadow-gold">
      {service.image_url && (
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
          <Image src={service.image_url} alt={service.name} fill className="object-cover" sizes="64px" />
        </div>
      )}
      <div className="flex flex-1 items-center justify-between gap-4 py-2">
        <div>
          <div className="flex items-center gap-2">
            {service.brand_name && (
              <span className="eyebrow text-gold-500">{service.brand_name}</span>
            )}
            {service.is_featured && (
              <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-700">
                Featured
              </span>
            )}
            {service.is_popular && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                Popular
              </span>
            )}
          </div>
          <p className="mt-1 font-display text-base text-emerald-900">{service.name}</p>
        </div>
        <PriceTag service={service} />
      </div>
    </div>
  );
}
