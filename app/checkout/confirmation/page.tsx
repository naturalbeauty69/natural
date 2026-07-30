import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import ShippingPolicy from "@/components/ShippingPolicy";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-700" />
      <h1 className="mt-4 text-3xl">Order Placed!</h1>
      {order && <p className="mt-2 font-mono text-sm text-ink-soft">Order #{order}</p>}
      <p className="mt-4 text-sm text-ink-soft">
        Our team will call you shortly to confirm your order before it&apos;s packed and shipped.
      </p>
      <div className="mt-8 text-left">
        <ShippingPolicy />
      </div>
      <Link href="/products" className="btn-primary mt-8 inline-flex">Continue Shopping</Link>
    </div>
  );
}
