import { Service } from "@/lib/types";

function formatNpr(value: number) {
  return `NPR ${value.toLocaleString("en-IN")}`;
}

export function formatPriceRange(service: Service) {
  if (service.is_price_hidden) return "Enquire for price";
  if (service.price_max && service.price_max !== service.price_min) {
    return `${formatNpr(service.price_min)} – ${formatNpr(service.price_max)}`;
  }
  if (service.show_starting_from) return `From ${formatNpr(service.price_min)}`;
  return formatNpr(service.price_min);
}

export default function PriceTag({ service }: { service: Service }) {
  return (
    <span className="font-mono text-sm font-medium text-emerald-700">
      {formatPriceRange(service)}
    </span>
  );
}
