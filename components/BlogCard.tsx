import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/data/blog";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card block overflow-hidden transition-shadow hover:shadow-gold">
      <div className="relative aspect-[16/10] bg-emerald-50">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="text-xs italic text-emerald-700/70">{post.coverImageCaption}</p>
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
