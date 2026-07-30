import { shippingPolicy } from "@/data/shipping-policy";

export default function ShippingPolicy({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "" : "card p-5"}>
      <p className="eyebrow text-gold-500">{shippingPolicy.heading}</p>
      <ul className="mt-2 space-y-1.5">
        {shippingPolicy.points.map((point) => (
          <li key={point} className="flex items-start gap-2 text-xs text-ink-soft">
            <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-700" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
