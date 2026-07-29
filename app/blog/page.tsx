import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import BlogCard from "@/components/BlogCard";
import { getBlogPosts } from "@/lib/get-data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Skin care, hair care, makeup, and beauty education articles from Natural Beauty Clinic & Academy.",
};

export default async function BlogIndexPage() {
  const blogPosts = await getBlogPosts();
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <Breadcrumbs items={[{ "label": "Blog" }]} />
      <SectionHeading
        eyebrow="Blog"
        title="Beauty & Career Insights"
        description="Skin care, hair care, makeup tips, and career guidance from our team."
        align="center"
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
