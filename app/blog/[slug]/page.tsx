import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandDivider from "@/components/BrandDivider";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import BlogContent from "@/components/BlogContent";
import BlogCard from "@/components/BlogCard";
import BlogReadTracker from "@/components/analytics/BlogReadTracker";
import BlogPostingSchema from "@/components/schema/BlogPostingSchema";
import { getBlogPosts } from "@/lib/get-data";

export async function generateStaticParams() {
  const blogPosts = await getBlogPosts();
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blogPosts = await getBlogPosts();
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.title,
    description: post.content.replace(/## /g, "").slice(0, 155),
    keywords: post.seoKeywords,
  };
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blogPosts = await getBlogPosts();
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <BlogPostingSchema post={post} />
      <BlogReadTracker title={post.title} category={post.category} />
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

      <p className="eyebrow mt-6 text-gold-500">{post.category}</p>
      <h1 className="mt-2 text-3xl md:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-ink-soft">
        {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        {" · "}{post.author}
        {" · "}{readingTime(post.content)} min read
      </p>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl2 bg-emerald-50">
        {post.coverImageUrl ? (
          <Image src={post.coverImageUrl} alt={post.coverImageCaption || post.title} fill priority className="object-cover" sizes="672px" />
        ) : (
          <div className="flex h-full items-center justify-center px-8 text-center">
            <p className="text-sm italic text-emerald-700/70">{post.coverImageCaption}</p>
          </div>
        )}
      </div>

      <BrandDivider className="mt-10" />

      <div className="mt-6">
        <BlogContent content={post.content} />
      </div>

      {post.faqs && post.faqs.length > 0 && (
        <>
          <BrandDivider className="mt-12" />
          <div className="mt-6">
            <h2 className="font-display text-xl text-emerald-900">Frequently Asked Questions</h2>
            <div className="mt-4 space-y-4">
              {post.faqs.map((f) => (
                <div key={f.question}>
                  <p className="font-medium text-ink">{f.question}</p>
                  <p className="mt-1 text-sm text-ink-soft">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {(post.relatedServiceLinks?.length || post.relatedCourseLinks?.length) ? (
        <div className="mt-10 rounded-xl2 bg-emerald-900 p-6 text-cream">
          <p className="font-display text-lg text-cream">Ready to book or learn more?</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {post.relatedServiceLinks?.map((l) => (
              <Link key={l.href} href={l.href} className="btn-gold text-sm">{l.label}</Link>
            ))}
            {post.relatedCourseLinks?.map((l) => (
              <Link key={l.href} href={l.href} className="btn-outline border-cream/30 text-sm text-cream hover:bg-cream/10">{l.label}</Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-2">
        {post.seoKeywords.map((kw) => (
          <span key={kw} className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">{kw}</span>
        ))}
      </div>

      {related.length > 0 && (
        <>
          <BrandDivider className="mt-14" />
          <div className="mt-6">
            <h2 className="font-display text-xl text-emerald-900">Related Articles</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </>
      )}
    </article>
  );
}
