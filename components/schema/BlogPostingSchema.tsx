import { BlogPost } from "@/data/blog";

const BASE = "https://naturalbeauty.com.np";

export default function BlogPostingSchema({ post }: { post: BlogPost }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.content.slice(0, 155),
    image: post.coverImageUrl ? `${BASE}${post.coverImageUrl}` : undefined,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      "@id": `${BASE}/#organization`,
      name: "Natural Beauty Clinic & Academy",
      logo: { "@type": "ImageObject", url: `${BASE}/images/logo/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/blog/${post.slug}` },
    keywords: post.seoKeywords.join(", "),
    articleSection: post.category,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
