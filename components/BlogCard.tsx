import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/data/blog";

function fallbackCover(category?: string | null) {
  const value = (category ?? "").toLowerCase();
  if (value.includes("hair")) return "/images/library/hair-smoothening-rebonding.webp";
  if (value.includes("makeup") || value.includes("bridal")) return "/images/library/nepali-bridal-makeup.webp";
  if (value.includes("skin") || value.includes("facial")) return "/images/library/Skin-and-facial-treatment.webp";
  if (value.includes("academy") || value.includes("career") || value.includes("training")) return "/images/library/professional-makeup-course.webp";
  return "/images/library/ai-skin-analysis.webp";
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const cover = post.coverImageUrl || fallbackCover(post.category);
  return (
    <Link href={`/blog/${post.slug}`} className="card block overflow-hidden transition-shadow hover:shadow-gold">
      <div className="relative aspect-[16/10] bg-emerald-50">
        {cover ? (
          <Image
            src={cover}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="text-xs italic text-emerald-700/70">{post.coverImageCaption || "Natural Beauty Clinic & Academy"}</p>
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="eyebrow text-gold-500">{post.category}</p>
        <p className="mt-2 font-display text-lg text-emerald-900">{post.title}</p>
        <p className="mt-2 text-sm text-ink-soft">
          {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          {" · "}{post.author}
        </p>
      </div>
    </Link>
  );
}
