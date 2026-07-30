import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import ProductsGrid from "@/components/ProductsGrid";
import { getProducts } from "@/lib/get-data";

export const metadata: Metadata = {
  title: "Shop Products",
  description: "Professional beauty and skincare products from Casmara, Lotus Professional, Paese, and more — order online with Cash on Delivery.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <Breadcrumbs items={[{ label: "Products" }]} />
      <SectionHeading
        eyebrow="Shop"
        title="Professional Beauty Products"
        description="Order online, pay Cash on Delivery — our team confirms every order by phone before it ships."
        align="center"
      />
      <div className="mt-10">
        <ProductsGrid products={products} />
      </div>
    </div>
  );
}
