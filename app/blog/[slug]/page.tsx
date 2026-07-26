import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandDivider from "@/components/BrandDivider";
import { blogPosts } from "@/data/blog";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.title,
    description: post.content.slice(0, 155),
    keywords: post.seoKeywords,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/blog" className="eyebrow text-emerald-500 hover:text-emerald-700">← All Articles</Link>

      <p className="eyebrow mt-6 text-gold-500">{post.category}</p>
      <h1 className="mt-2 text-3xl md:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-ink-soft">
        {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        {" · "}{post.author}
      </p>

      <div className="mt-8 flex aspect-[16/9] items-center justify-center rounded-xl2 bg-emerald-50 px-8 text-center">
        <p className="text-sm italic text-emerald-700/70">{post.coverImageCaption}</p>
      </div>

      <BrandDivider className="mt-10" />

      <div className="mt-6 text-base leading-relaxed text-ink-soft">
        <p>{post.content}</p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {post.seoKeywords.map((kw) => (
          <span key={kw} className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">{kw}</span>
        ))}
      </div>
    </article>
  );
}
